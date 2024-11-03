type Customer = {
    id: string;
    email: string;
    name: string;
}

type Item = {
    id: string;
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