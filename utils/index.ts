import jwt from "jsonwebtoken";

export function signJwt(payload: string | Buffer | object, secret: jwt.Secret): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "15m" }, function (err, encoded) {
            if (err) {
                reject(err);
                throw createError({ statusCode: 500, statusMessage: "Internal Server Error", message: "Failed to sign jwt", data: err.message })
            }
            resolve(String(encoded));
        });
    });
}