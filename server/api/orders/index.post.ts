import vine from "@vinejs/vine";
import { ResPostOrders } from "~/dto/orders";
import { ReqCreateInvoice } from "~/dto/xendit";
import { prisma } from "~/prisma/db";
import { createInvoice } from "~/server/utils/xendit";

const bodySchema = vine.object({
    items: vine.array(vine.object({
        id: vine.number(),
        quantity: vine.number(),
    })).minLength(1).distinct("id"),
});

export default defineEventHandler<Promise<ResPostOrders>>(async (event) => {
    const claims = await getClaims(event);
    if (claims === null) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized", message: "User not logged in" });
    }

    const [err, body] = await readValidatedBody(event, (data) => vine.tryValidate({ schema: bodySchema, data: data }));
    if (err !== null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input" });
    }

    const tickets = await prisma.ticket.findMany({ where: { id: { in: body.items.map(item => item.id) } } });
    if (tickets.length !== body.items.length) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input" });
    }

    const itemQuantity = new Map<number, number>();
    for (const ticket of body.items) {
        itemQuantity.set(ticket.id, ticket.quantity);
    }

    let total = 0;
    for (const ticket of tickets) {
        const quantity = itemQuantity.get(ticket.id) || 0;
        total += quantity + ticket.price.toNumber();
    }

    const transaction = await prisma.transaction.create({
        data: {
            userId: claims.id,
            orderItems: {
                create: tickets.map((ticket) => {
                    const quantity = itemQuantity.get(ticket.id) || 0;
                    const subTotal = quantity * ticket.price.toNumber();

                    return {
                        ticketId: ticket.id,
                        quantity: quantity,
                        subTotal: subTotal,
                    };
                }),
            },
            total: total,
        },
    });

    const xenditReq: ReqCreateInvoice = {
        customer: {
            id: claims.id.toString(),
            email: claims.email,
            name: claims.name,
        },
        transactionId: transaction.id.toString(),
        items: tickets.map((ticket) => {
            const quantity = itemQuantity.get(ticket.id) || 0;

            return {
                id: ticket.id.toString(),
                name: ticket.name,
                price: ticket.price.toNumber(),
                quantity: quantity,
            }
        }),
        total: total,

    }


    const invoice = await createInvoice(xenditReq);
    await prisma.transaction.update({
        where: {
            id: transaction.id,
        },
        data: {
            paymentLink: invoice.invoiceUrl,
        },
    });

    const response: ResPostOrders = {
        data: {
            id: transaction.id,
            status: transaction.status.toString(),
            paymentLink: invoice.invoiceUrl,
        }
    }
    return response;
});