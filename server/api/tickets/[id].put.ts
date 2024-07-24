import vine from "@vinejs/vine";
import { ReqPutTickets } from "~/dto/tickets";
import { prisma } from "~/prisma/db";

const paramsSchema = vine.object({
    id: vine.number(),
});

const putTicketSchema = vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    copywriting: vine.string().minLength(1).maxLength(4096),
    start: vine.date({ formats: "YYYY-MM-DD HH:mm" }),
    end: vine.date({ formats: "YYYY-MM-DD HH:mm" }).afterOrSameAs("start"),
    price: vine.number().min(0),
    quota: vine.number().min(0),
    medias: vine.array(vine.string().url()),
});

export default defineEventHandler<Promise<ReqPutTickets>>(async (event) => {
    const [paramsError, params] = await getValidatedRouterParams(event, (data) => vine.tryValidate({ schema: paramsSchema, data: data }));
    if (paramsError != null) {
        throw createError({ statusCode: 404, statusMessage: "Not Found", message: "ID not found", data: paramsError.messages });
    }

    const [bodyError, body] = await readValidatedBody(event, (data) => vine.tryValidate({ schema: putTicketSchema, data: data }));
    if (bodyError != null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: bodyError.messages });
    }

    const updatedTicket = await prisma.ticket.update({
        where: {
            id: params.id,
        },
        data: {
            name: body.name,
            copywriting: body.copywriting,
            start: body.start,
            end: body.end,
            price: body.price,
            quota: body.quota,
            medias: {
                deleteMany: {},
                create: body.medias.map((media) => { return { url: media } }),
            },
        },
        include: {
            medias: true,
        },
    });

    const response: ReqPutTickets = {
        name: updatedTicket.name,
        copywriting: updatedTicket.copywriting,
        start: updatedTicket.start.toISOString(),
        end: updatedTicket.end.toISOString(),
        price: updatedTicket.price.toNumber(),
        quota: updatedTicket.quota,
        medias: updatedTicket.medias.map((media) => media.url)
    };

    return response;
});
