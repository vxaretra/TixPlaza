import vine from "@vinejs/vine";
import { prisma } from "~/prisma/db";

const bodySchema = vine.object({
    code: vine.number().range([100000, 999999]),
});

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const user = session.user;

    const [err, body] = await readValidatedBody(event, (data) =>
        vine.tryValidate({ schema: bodySchema, data: data }),
    );
    if (err !== null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Invalid code",
        });
    }

    const storedCode = await useStorage("redis").getItem(
        `user:${user.id}:code`,
    );
    if (storedCode === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Code expired, please resend another code",
        });
    }

    if (body.code.toString() !== storedCode.toString()) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Invalid code",
        });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
    });

    return "";
});
