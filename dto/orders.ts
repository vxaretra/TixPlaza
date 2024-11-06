type Ticket = {
    id: number;
    name: string,
    medias: {
        id: number;
        url: string;
    }[];
}

export type ResPostOrders = {
    data: {
        id: number;
        status: string;
        paymentLink: string | null;
    };
}

export type ResGetOrders = {
    pagination: {
        total: number,
        totalPages: number,
        currentPage: number,
        limit: number,
    },
    data: {
        id: number;
        ticket: Ticket;
        quantity: number;
        subtotal: number;
        status: string;
    }[];
}