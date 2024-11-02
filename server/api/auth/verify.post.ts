import vine from "@vinejs/vine";
import { prisma } from "~/prisma/db";
import { getClaims } from "~/server/utils/auth";

const bodySchema = vine.object({
    code: vine.number().range([100000, 999999]),
});

export default defineEventHandler(async (event) => {
    const claims = await getClaims(event);
    if (claims === null) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized", message: "No Authorization header found" });
    }

    const [err, body] = await readValidatedBody(event, (data) => vine.tryValidate({ schema: bodySchema, data: data }));
    if (err !== null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid code" });
    }

    const verificationCode = await prisma.verificationCode.findFirst({ where: { code: body.code, userId: claims.id } });
    if (verificationCode === null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid code" });
    }

    await prisma.user.update({ where: { id: claims.id }, data: { isVerified: true } });

    return "";
});