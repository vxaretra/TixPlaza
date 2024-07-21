import vine, { errors } from "@vinejs/vine"
import { AuthTokenPayload, ReqPostRegister, ResPostRegister } from "~/dto/auth"
import { prisma } from "~/prisma/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

async function validatePostRegister(req: ReqPostRegister) {
  try {
    const schema = vine.object({
      email: vine.string().trim().email(),
      password: vine.string().trim().minLength(6).maxLength(32),
      name: vine.string().trim().minLength(1).maxLength(255),
      phoneNumber: vine.string().trim().mobile(),
    });

    await vine.validate({ schema: schema, data: req });
  } catch (err) {
    if (err instanceof errors.E_VALIDATION_ERROR) {
      throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Invalid input", data: err.messages });
    }
  }
}

async function hashPassword(password: string): Promise<string> {
  const SALT_ROUND = 10;
  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

function signJwt(payload: string | Buffer | object, secret: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: "15m" }, function (err, encoded) {
      if (err) {
        reject(err);
        throw createError({ statusCode: 500, statusMessage: "Internal Server Error", message: "Failed to sign jwt", data: err.message })
      }
      resolve(String(encoded));
    })
  })
}

export default defineEventHandler<Promise<ResPostRegister>>(async (event) => {
  const body = await readBody<ReqPostRegister>(event);

  await validatePostRegister(body);

  const existingUser = await prisma.user.findFirst({ where: { email: body.email } });
  if (existingUser !== null) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Email already exists" });
  }

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: await hashPassword(body.password),
      name: body.name,
      phoneNumber: body.phoneNumber,
    }
  })

  const payload: AuthTokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };

  const jwtSecret = process.env.JWT_SECRET || "";
  const token = await signJwt(payload, jwtSecret);

  setResponseStatus(event, 201);
  return { data: { token: token } };
})