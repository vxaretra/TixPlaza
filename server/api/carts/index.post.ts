import vine from "@vinejs/vine";
import { prisma } from "~/prisma/db";

const bodySchema = vine.object({
    itemId: vine.number(),
    quantity: vine.number().min(0),
});

export default defineEventHandler(async (event) => {
    const claims = await getClaims(event);
    if (claims === null) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized", message: "User not logged in" });
    }

    const [err, body] = await readValidatedBody(event, (data) => vine.tryValidate({ schema: bodySchema, data: data }));
    if (err !== null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input" });
    }

    const ticket = await prisma.ticket.findFirst({ where: { id: body.itemId } });
    if (ticket === null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Ticket not found" });
    }

    await prisma.cart.upsert({
        where: {
            userId_ticketId: {
                userId: claims.id,
                ticketId: ticket.id,
            },
        },
        update: {
            quantity: body.quantity,
        },
        create: {
            userId: claims.id,
            ticketId: ticket.id,
            quantity: body.quantity,
        }
    });

    return {};
});