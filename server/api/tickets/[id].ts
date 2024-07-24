import vine from "@vinejs/vine";
import { ResGetTicketDetail } from "~/dto/tickets";
import { prisma } from "~/prisma/db";

const ticketDetailSchema = vine.object({
    id: vine.number(),
});

export default defineEventHandler<Promise<ResGetTicketDetail>>(async (event) => {
    const [error, params] = await getValidatedRouterParams(event, (data) => vine.tryValidate({ schema: ticketDetailSchema, data: data }));
    if (error !== null) {
        throw createError({ statusCode: 404, statusMessage: "Not Found", message: "ID not found" });
    }

    const ticket = await prisma.ticket.findFirst({ where: { id: params.id } })
    if (ticket === null) {
        throw createError({ statusCode: 404, statusMessage: "Not Found", message: "ID not found" });
    }

    const response: ResGetTicketDetail = {
        data: {
            id: ticket.id,
            name: ticket.name,
            copywriting: ticket.copywriting,
            start: ticket.start.toISOString(),
            end: ticket.end.toISOString(),
            price: ticket.price.toNumber(),
            quota: ticket.quota,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString(),
        },
    };

    return response;
});
