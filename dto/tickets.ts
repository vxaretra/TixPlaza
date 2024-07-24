export type ReqPostTickets = {
    name: string
    copywriting: string
    start: Date
    end: Date
    price: number
    quota: number
    medias: string[]
}

export type ResPostTickets = {
    data: {
        name: string
        copywriting: string
        start: string
        end: string
        price: number
        quota: number
        medias: string[]
    }
}

export type ResGetTickets = {
    pagination: {
        total: number,
        totalPages: number,
        currentPage: number,
        limit: number,
    },
    data: {
        id: number
        name: string
        copywriting: string
        start: string
        end: string
        price: number
        quota: number
        createdAt: string
        updatedAt: string
    }[]
}

export type ResGetTicketDetail = {
    data: {
        id: number
        name: string
        copywriting: string
        start: string
        end: string
        price: number
        quota: number
        createdAt: string
        updatedAt: string
    }
}
