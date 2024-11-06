import { TransactionStatus } from "@prisma/client";
import vine from "@vinejs/vine";
import { ResGetOrders } from "~/dto/orders";
import { prisma } from "~/prisma/db";

const querySchema = vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(256).optional(),
});

export default defineEventHandler<Promise<ResGetOrders>>(async (event) => {
    const claims = await getClaims(event);
    if (claims === null) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized", message: "User not logged in" });
    }

    const [error, query] = await getValidatedQuery(event, (data) => vine.tryValidate({ schema: querySchema, data: data }));
    if (error !== null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: error.messages });
    }

    if (query.page === undefined) query.page = 1;
    if (query.limit === undefined) query.limit = 10;

    const orderTickets = await prisma.orderTickets.findMany({
        orderBy: [
            {
                transaction: { createdAt: "desc" }
            },
            {
                ticket: { name: "asc" }
            },
        ],
        where: {
            transaction: {
                userId: claims.id,
                status: TransactionStatus.PAID,
            },
        },
        skip: (query.page - 1) * query.limit, take: query.limit,
        include: {
            ticket: {
                include: { medias: true },
            },
            transaction: true,
        },
    });

    const total = await prisma.orderTickets.count({
        where: {
            transaction: {
                userId: claims.id,
            },
        },
    });

    const response: ResGetOrders = {
        pagination: {
            total: total,
            totalPages: Math.ceil(total / query.limit),
            currentPage: query.page,
            limit: query.limit,
        },
        data: orderTickets.map((orderTicket) => {
            return {
                id: orderTicket.transactionId,
                ticket: {
                    id: orderTicket.ticket.id,
                    name: orderTicket.ticket.name,
                    medias: orderTicket.ticket.medias.map((media) => {
                        return { id: media.id, url: media.url }
                    }),
                },
                quantity: orderTicket.quantity,
                subtotal: orderTicket.subTotal.toNumber(),
                status: orderTicket.transaction.status.toString(),
            }
        }),
    };

    return response;
});