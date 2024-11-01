import type { $Enums } from "@prisma/client"
import type { Jwt, JwtPayload } from "jsonwebtoken"

export type ReqPostRegister = {
    email: string
    password: string
    name: string
    phoneNumber: string
}

export type ResPostRegister = {
    data: { token: string }
}

export type ReqPostLogin = {
    email: string
    password: string
}

export type ResPostLogin = {
    data: {
        token: string
        isVerified: boolean
    }
}

export type AuthTokenPayload = {
    id: number
    name: string
    email: string
    phoneNumber: string
    role: $Enums.Role
}

export type JwtAuthClaims = AuthTokenPayload & JwtPayload
