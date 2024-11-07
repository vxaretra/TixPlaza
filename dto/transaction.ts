export type ResGetTransactions = {
    pagination: {
        total: number,
        totalPages: number,
        currentPage: number,
        limit: number,
    },
    data: {
        id: number;
        total: number;
        status: string,
        paymentLink: string | null;
        createdAt: string;
        expiredAt: string;
    }[];
}