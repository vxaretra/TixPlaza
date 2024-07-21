import type { $Enums } from "@prisma/client"

export type ReqPostRegister = {
    email: string
    password: string
    name: string
    phoneNumber: string
}

export type ResPostRegister = {
    data: { token: string }
}

export type AuthTokenPayload = {
    id: number
    name: string
    email: string
    phoneNumber: string
    role: $Enums.Role
}