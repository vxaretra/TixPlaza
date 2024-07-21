import vine, { errors } from "@vinejs/vine"
import { ReqPostRegister } from "~/dto/auth"
import { prisma } from "~/prisma/db"

async function validatePostRegister(req: ReqPostRegister) {
  try {
    const schema = vine.object({
      email: vine.string().trim().email(),
      password: vine.string().trim().minLength(6).maxLength(32),
      name: vine.string().trim().minLength(1).maxLength(255),
      phoneNumber: vine.string().trim().mobile(),
    });

    await vine.validate({ schema: schema, data: req });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: error.messages });
    }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ReqPostRegister>(event);

  await validatePostRegister(body);

  const existingUser = await prisma.user.findFirst({ where: { email: body.email } });
  if (existingUser !== null) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Email already exists" });
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
})