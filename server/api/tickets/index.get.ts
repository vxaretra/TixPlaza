import vine from "@vinejs/vine";
import { ResGetTickets } from "~/dto/tickets";
import { prisma } from "~/prisma/db";

const querySchema = vine.object({
  q: vine.string().optional(),
  categoryIds: vine.array(vine.number()).optional(),
  page: vine.number().min(1).optional(),
  sortBy: vine.string().optional(),
  sortOrder: vine.enum(["asc", "desc"]).optional(),
  limit: vine.number().min(1).max(256).optional(),
});

export default defineEventHandler<Promise<ResGetTickets>>(async (event) => {
  const [error, query] = await getValidatedQuery(event, (data) => {
    // Narrow `data` so TS stops complaining
    const rawData = data as Record<string, unknown>;

    if (typeof rawData.categoryIds === "string") {
      rawData.categoryIds = rawData.categoryIds
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id));
    }

    return vine.tryValidate({ schema: querySchema, data: rawData });
  });

  if (error !== null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid input",
      data: error.messages,
    });
  }

  if (query.q === undefined) query.q = "";
  if (query.page === undefined) query.page = 1;
  if (query.limit === undefined) query.limit = 10;

  // Build orderBy dynamically
  const { sortBy, sortOrder } = query;

  const orderBy =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : { name: "asc" as const }; // default if not provided

  const tickets = await prisma.ticket.findMany({
    where: {
      name: {
        contains: query.q,
      },
      ...(query.categoryIds?.length && !query.categoryIds?.includes(0)
        ? {
            categories: {
              some: {
                categoryId: { in: query.categoryIds },
              },
            },
          }
        : {}),
    },
    orderBy,
    skip: (query.page - 1) * query.limit,
    take: query.limit,
    include: {
      medias: true,
      categories: true,
    },
  });

  const total = await prisma.ticket.count();

  const response: ResGetTickets = {
    pagination: {
      total: total,
      totalPages: Math.ceil(total / query.limit),
      currentPage: query.page,
      limit: query.limit,
    },
    data: tickets.map((ticket) => {
      return {
        id: ticket.id,
        name: ticket.name,
        copywriting: ticket.copywriting,
        start: ticket.start.toISOString(),
        end: ticket.end.toISOString(),
        price: ticket.price.toNumber(),
        quota: ticket.quota,
        lat: ticket.lat,
        lon: ticket.lon,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
        medias: ticket.medias.map((media) => {
          return { id: media.id, url: media.url };
        }),
        categories: ticket.categories.map((category) => {
          return {
            categoryId: category.categoryId,
            name: category.name,
            icon: category.icon,
          };
        }),
      };
    }),
  };

  return response;
});
