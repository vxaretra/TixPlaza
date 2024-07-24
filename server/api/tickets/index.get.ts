import vine from "@vinejs/vine";
import { ResGetTickets } from "~/dto/tickets";
import { prisma } from "~/prisma/db";

const querySchema = vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(256).optional(),
});

export default defineEventHandler<Promise<ResGetTickets>>(async (event) => {
    const [error, query] = await getValidatedQuery(event, (data) => vine.tryValidate({ schema: querySchema, data: data }));
    if (error !== null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: error.messages });
    }

    if (query.page === undefined) query.page = 1;
    if (query.limit === undefined) query.limit = 10;

    const tickets = await prisma.ticket.findMany({ skip: (query.page - 1) * query.limit, take: query.limit });
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
                end: ticket.start.toISOString(),
                price: ticket.price.toNumber(),
                quota: ticket.quota,
                createdAt: ticket.createdAt.toISOString(),
                updatedAt: ticket.updatedAt.toISOString(),
            };
        }),
    };

    return response;
});