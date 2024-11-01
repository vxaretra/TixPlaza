import type { JwtAuthClaims } from "@/dto/auth";
import jwt from "jsonwebtoken";

export function randomFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function signJwt(payload: string | Buffer | object, secret: jwt.Secret): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "15m" }, function (err, encoded) {
            if (err) {
                reject(err);
                throw createError({ statusCode: 500, statusMessage: "Internal Server Error", message: "Failed to sign jwt", data: err.message })
            }
            resolve(String(encoded));
        });
    });
}

export function verifyJwt(token: string, secret: jwt.Secret): Promise<JwtAuthClaims> {
    return new Promise<JwtAuthClaims>((resolve, reject) => {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                reject(err);
                throw createError({ statusCode: 500, statusMessage: "Internal Server Error", message: "Failed to verify jwt", data: err.message })
            }

            resolve(decoded as JwtAuthClaims);
        });
    });
}