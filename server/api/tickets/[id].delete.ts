import vine from "@vinejs/vine";
import { ResDeleteTickets } from "~/dto/tickets";
import { prisma } from "~/prisma/db";

const paramsSchema = vine.object({
    id: vine.number(),
});

export default defineEventHandler<Promise<ResDeleteTickets>>(async (event) => {
    const [error, params] = await getValidatedRouterParams(event, (data) => vine.tryValidate({ schema: paramsSchema, data: data }));
    if (error !== null) {
        throw createError({ statusCode: 404, statusMessage: "Not Found", message: "ID not found", data: error.messages });
    }

    await prisma.ticketMedia.deleteMany({ where: { ticketId: params.id } });
    await prisma.ticket.delete({ where: { id: params.id } });

    const response: ResDeleteTickets = {
        data: null,
    };

    return response;
});