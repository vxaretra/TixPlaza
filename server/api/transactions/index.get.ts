import vine from "@vinejs/vine";
import { ResGetTransactions } from "~/dto/transaction";
import { prisma } from "~/prisma/db";

const querySchema = vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(256).optional(),
});

export default defineEventHandler(async (event) => {
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

    const transactions = await prisma.transaction.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            userId: claims.id,
        },
        skip: (query.page - 1) * query.limit, take: query.limit,
    });

    const total = await prisma.transaction.count({
        where: {
            userId: claims.id,
        },
    });

    const response: ResGetTransactions = {
        pagination: {
            total: total,
            totalPages: Math.ceil(total / query.limit),
            currentPage: query.page,
            limit: query.limit,
        },
        data: transactions.map((transcation) => {
            const expiredAt = new Date(transcation.createdAt);
            expiredAt.setDate(expiredAt.getDate() + 1)

            return {
                id: transcation.id,
                total: transcation.total.toNumber(),
                status: transcation.status.toString(),
                paymentLink: transcation.paymentLink,
                createdAt: transcation.createdAt.toISOString(),
                expiredAt: expiredAt.toISOString(),
            }
        }),
    };

    return response;
});