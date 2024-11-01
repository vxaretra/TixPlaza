import nodemailer from "nodemailer";

const config = useRuntimeConfig();
const transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: 2525,
    auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
    },
});

export async function emailVerificationCode(to: string, code: number) {
    const body = {
        "from": "TixPlaza <tixplaza@resend.dev>",
        "to": to,
        "subject": "Account Verification",
        "text": `Your verification code: ${code}`,
    };

    const info = await transport.sendMail({
        from: '"TixPlaza <tixplaza@mailtrap.dev>', // sender address
        to: to, // list of receivers
        subject: "Account Verification", // Subject line
        text: `Your verification code is: ${code}`, // plain text body
    });

    console.info(info);
}
