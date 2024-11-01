import type { H3Event } from "h3"
import { verifyJwt } from "~/utils";
import { config } from "~/utils/config";

export async function getClaims(event: H3Event) {
    const authHeader = getHeader(event, "Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized", message: "No Authorization header found" });
    }

    const token = authHeader.split(" ")[1];
    const secret = config.JWT_SECRET;

    const claims = await verifyJwt(token, secret);
    return claims;
}