import { ReqPostRegister, ResPostRegister } from "~/dto/auth"
import { prisma } from "~/prisma/db"

export default defineEventHandler<Promise<ResPostRegister>>(async (event) => {
  const body = await readBody<ReqPostRegister>(event)

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