import vine, { errors } from "@vinejs/vine";
import { ReqPostRegister, ResPostRegister } from "~/dto/auth";
import { prisma } from "~/prisma/db";
import bcrypt from "bcrypt";

async function validatePostRegister(req: ReqPostRegister) {
    try {
        const schema = vine.object({
            email: vine.string().trim().email(),
            password: vine.string().minLength(6).maxLength(32),
            name: vine.string().trim().minLength(1).maxLength(255),
            phoneNumber: vine.string().trim().mobile(),
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

async function hashPassword(password: string): Promise<string> {
    const SALT_ROUND = 10;
    const salt = await bcrypt.genSalt(SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export default defineEventHandler<Promise<ResPostRegister>>(async (event) => {
    const body = await readBody<ReqPostRegister>(event);

    await validatePostRegister(body);

    const existingUser = await prisma.user.findFirst({
        where: { email: body.email },
    });
    if (existingUser !== null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Email already exists",
        });
    }

    await prisma.user.create({
        data: {
            email: body.email,
            password: await hashPassword(body.password),
            name: body.name,
            phoneNumber: body.phoneNumber,
        },
    });

    const response: ResPostRegister = {
        data: { message: "Register successful" },
    };

    setResponseStatus(event, 201);
    return response;
});
