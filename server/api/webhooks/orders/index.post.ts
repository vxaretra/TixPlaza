import { TransactionStatus } from "@prisma/client";
import vine from "@vinejs/vine";
import { InvoiceStatus } from "xendit-node/invoice/models";
import { prisma } from "~/prisma/db";

const bodySchema = vine.object({
    id: vine.string(),
    "external_id": vine.number(),
    "user_id": vine.string(),
    status: vine.enum(InvoiceStatus),
    "merchant_name": vine.string(),
    amount: vine.number(),
    created: vine.string(),
    updated: vine.string(),
    currency: vine.string(),
});

export default defineEventHandler(async (event) => {
    const token = getHeader(event, "x-callback-token")
    if (token === undefined) {
        throw createError({ status: 400, message: "Invalid token" });
    }

    const [err, body] = await readValidatedBody(event, (data) => vine.tryValidate({ schema: bodySchema, data: data }));
    if (err !== null) {
        throw createError({ statusCode: 400, message: "Invalid payload" });
    }

    setResponseStatus(event, 200);
    send(event);

    let status: TransactionStatus;
    switch (body.status) {
        case InvoiceStatus.Paid:
            await prisma.transaction.update({
                where: {
                    id: body["external_id"],
                },
                data: {
                    status: TransactionStatus.PAID,
                }
            });
            break;
        case InvoiceStatus.Expired:
            status = TransactionStatus.EXPIRED;

            await prisma.$transaction(async (prisma) => {
                const orderTickets = await prisma.orderTickets.findMany({
                    where: {
                        transactionId: body["external_id"],
                    },
                })

                for (const orderTicket of orderTickets) {
                    await prisma.ticket.update({
                        where: {
                            id: orderTicket.ticketId,
                        },
                        data: {
                            quota: {
                                increment: orderTicket.quantity,
                            },
                        },
                    });
                }

                await prisma.transaction.update({
                    where: {
                        id: body["external_id"],
                    },
                    data: {
                        status: TransactionStatus.EXPIRED,
                    }
                });
            });

            break;
        default:
            status = TransactionStatus.PENDING;
    }
});