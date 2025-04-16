import type { TicketMedia } from "./tickets"

export type ResGetCarts = {
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
        lat: number | null
        lon: number | null
        medias: TicketMedia[]
        createdAt: string
        updatedAt: string
    }[]
}