import type { H3Event } from "h3"
import { verifyJwt } from "~/utils";

export async function getClaims(event: H3Event) {
    const config = useRuntimeConfig();

    const authHeader = getHeader(event, "Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized", message: "No Authorization header found" });
    }

    const token = authHeader.split(" ")[1];
    const secret = config.jwtSecret;

    const claims = await verifyJwt(token, secret);
    return claims;
}