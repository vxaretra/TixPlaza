import { Xendit } from "xendit-node";
import { CreateInvoiceRequest, Invoice } from "xendit-node/invoice/models";
import { ReqCreateInvoice } from "~/dto/xendit";

const secretKey = useRuntimeConfig().xenditKey;

const client = new Xendit({ secretKey: secretKey });
const invoiceClient = client.Invoice;

export async function createInvoice(req: ReqCreateInvoice): Promise<Invoice> {
    const data: CreateInvoiceRequest = {
        externalId: req.transactionId,
        amount: req.total,
        customer: {
            customerId: req.customer.id,
            email: req.customer.email,
            givenNames: req.customer.name,
        },
        items: req.items,
    };

    const response = await invoiceClient.createInvoice({ data: data });
    return response;
}