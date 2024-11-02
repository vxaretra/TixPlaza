import type { H3Event } from "h3"
import { JwtAuthClaims } from "~/dto/auth";
import { verifyJwt } from "~/utils";

export async function getClaims(event: H3Event): Promise<JwtAuthClaims | null> {
    const config = useRuntimeConfig();

    const authHeader = getHeader(event, "Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    const secret = config.jwtSecret;

    const claims = await verifyJwt(token, secret);
    return claims;
}