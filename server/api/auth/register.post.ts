import vine, { errors } from "@vinejs/vine"
import { AuthTokenPayload, ReqPostRegister, ResPostRegister } from "~/dto/auth"
import { prisma } from "~/prisma/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { randomFromInterval } from "~/utils";

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

async function emailVerificationCode(to: string, code: number) {
  const RESEND_URL = process.env.RESEND_URL;
  const RESEND_TOKEN = process.env.RESEND_TOKEN;

  if (RESEND_URL === undefined || RESEND_TOKEN === undefined) {
    throw createError("Failed to send verification email");
  }

  const body = {
    "from": "TixPlaza <tixplaza@resend.dev>",
    "to": to,
    "subject": "Account Verification",
    "text": `Your verification code: ${code}`,
  };

  try {
    await $fetch(`${RESEND_URL}/emails`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error", message: "Failed to send verification email" });
  }
}

export default defineEventHandler<Promise<ResPostRegister>>(async (event) => {
  const body = await readBody<ReqPostRegister>(event);

  await validatePostRegister(body);

  const existingUser = await prisma.user.findFirst({ where: { email: body.email } });
  if (existingUser !== null) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "Email already exists" });
  }

  const verificationCode: number = randomFromInterval(100000, 999999);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: await hashPassword(body.password),
      name: body.name,
      phoneNumber: body.phoneNumber,
      verificationCode: {
        create: {
          code: verificationCode,
        }
      }
    }
  });

  await emailVerificationCode("delivered@resend.dev", verificationCode);

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