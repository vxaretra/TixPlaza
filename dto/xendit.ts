type Customer = {
    id: string;
    email: string;
    name: string;
}

type Item = {
    name: string;
    price: number;
    quantity: number;
}

export type ReqCreateInvoice = {
    transactionId: string;
    customer: Customer;
    items: Item[];
    total: number;
}