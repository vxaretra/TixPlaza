import vine, { errors } from "@vinejs/vine"
import { ReqPostRegister } from "~/dto/auth"
import { prisma } from "~/prisma/db"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ReqPostRegister>(event);

    const schema = vine.object({
      email: vine.string().trim().email(),
      password: vine.string().trim().minLength(6).maxLength(32),
      name: vine.string().trim().minLength(1).maxLength(255),
      phoneNumber: vine.string().trim().mobile(),
    });

    await vine.validate({ schema: schema, data: body });

    const existingUser = await prisma.user.findFirst({ where: { email: body.email } });
    if (existingUser !== null) {
      setResponseStatus(event, 400);
      return { error: "Email already exists" };
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
        phoneNumber: body.phoneNumber,
      }
    })

    setResponseStatus(event, 201);
    return { email: user.email };
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      setResponseStatus(event, 400);
      return { error: error.messages };
    }

    setResponseStatus(event, 500);
    return { error: "Internal Server Error" };
  }
})