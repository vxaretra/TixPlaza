import vine, { errors } from "@vinejs/vine";
import { ReqPostTickets, ResPostTickets } from "~/dto/tickets";
import { prisma } from "~/prisma/db";

async function validatePostTickets(req: ReqPostTickets) {
    try {
        const schema = vine.object({
            name: vine.string().trim().minLength(1).maxLength(255),
            copywriting: vine.string().minLength(1).maxLength(4096),
            start: vine.date({ formats: "YYYY-MM-DD HH:mm" }),
            end: vine.date({ formats: "YYYY-MM-DD HH:mm" }).afterOrSameAs("start"),
            price: vine.number().min(0),
            quota: vine.number().min(0),
            medias: vine.array(vine.string().url()),
        });

        await vine.validate({ schema: schema, data: req });
    } catch (err) {
        if (err instanceof errors.E_VALIDATION_ERROR) {
            throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: err.messages });
        }
    }
}

export default defineEventHandler(async (event) => {
    const body = await readBody<ReqPostTickets>(event);

    await validatePostTickets(body);

    const ticket = await prisma.ticket.create({
        data: {
            name: body.name,
            copywriting: body.copywriting,
            start: new Date(body.start),
            end: new Date(body.end),
            price: body.price,
            quota: body.quota,
            medias: {
                create: body.medias.map((media) => { return { url: media } }),
            },
        },
        include: {
            medias: true,
        },
    });

    const response: ResPostTickets = {
        data: {
            name: ticket.name,
            copywriting: ticket.copywriting,
            start: ticket.start.toISOString(),
            end: ticket.end.toISOString(),
            price: ticket.price.toNumber(),
            quota: ticket.quota,
            medias: ticket.medias.map((media) => media.url),
        },
    };

    setResponseStatus(event, 201);
    return response;
});