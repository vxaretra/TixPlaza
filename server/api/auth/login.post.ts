import vine, { errors } from "@vinejs/vine";
import { AuthTokenPayload, ReqPostLogin, ResPostLogin } from "~/dto/auth";
import { prisma } from "~/prisma/db";
import bcrypt from "bcrypt"
import { signJwt } from "~/utils";

async function validatePostLogin(req: ReqPostLogin) {
    try {
        const schema = vine.object({
            email: vine.string().trim().email(),
            password: vine.string().minLength(6).maxLength(32),
        });

        await vine.validate({ schema: schema, data: req });
    } catch (err) {
        if (err instanceof errors.E_VALIDATION_ERROR) {
            throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: err.messages });
        }
    }
}

export default defineEventHandler<Promise<ResPostLogin>>(async (event) => {
    const config = useRuntimeConfig();

    const body = await readBody<ReqPostLogin>(event);

    await validatePostLogin(body);

    const user = await prisma.user.findFirst({ where: { email: body.email } });
    if (user === null) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Wrong email address" });
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
        throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Wrong password" });
    }

    const payload: AuthTokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
    };

    const token = await signJwt(payload, config.public.jwtSecret);

    const response: ResPostLogin = {
        data: {
            token: token,
            isVerified: user.isVerified,
        },
    };

    return response;
});