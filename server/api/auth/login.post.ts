import vine, { errors } from "@vinejs/vine";
import { ReqPostLogin, ResPostLogin } from "~/dto/auth";
import { prisma } from "~/prisma/db";
import bcrypt from "bcrypt";
import { randomFromInterval } from "~/utils";

async function validatePostLogin(req: ReqPostLogin) {
    try {
        const schema = vine.object({
            email: vine.string().trim().email(),
            password: vine.string().minLength(6).maxLength(32),
        });

        await vine.validate({ schema: schema, data: req });
    } catch (err) {
        if (err instanceof errors.E_VALIDATION_ERROR) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Invalid input",
                data: err.messages,
            });
        }
    }
}

export default defineEventHandler<Promise<ResPostLogin>>(async (event) => {
    const body = await readBody<ReqPostLogin>(event);

    await validatePostLogin(body);

    const user = await prisma.user.findFirst({ where: { email: body.email } });
    if (user === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Wrong email address",
        });
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Wrong password",
        });
    }

    if (user.isVerified === false) {
        const code = randomFromInterval(100000, 999999);
        await useStorage("redis").setItem(`user:${user.id}:code`, code, {
            ttl: 60,
        });

        try {
            await emailVerificationCode(user.email, code);
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "Failed to send verification email",
            });
        }
    }

    await setUserSession(event, {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        },
    });

    const response: ResPostLogin = {
        data: {
            isVerified: user.isVerified,
        },
    };

    return response;
});
