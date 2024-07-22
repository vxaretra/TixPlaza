
class Config {
    readonly DATABASE_URL: string;
    readonly JWT_SECRET: string;
    readonly RESEND_URL: string;
    readonly RESEND_TOKEN: string;

    constructor() {
        if (process.env.DATABASE_URL === undefined) {
            throw createError("DATABASE_URL is not initialized");
        }
        this.DATABASE_URL = process.env.DATABASE_URL;

        if (process.env.JWT_SECRET === undefined) {
            throw createError("JWT_SECRET is not initialized");
        }
        this.JWT_SECRET = process.env.JWT_SECRET;

        if (process.env.RESEND_URL === undefined) {
            throw createError("RESEND_URL is not initialized");
        }
        this.RESEND_URL = process.env.RESEND_URL;

        if (process.env.RESEND_TOKEN === undefined) {
            throw createError("RESEND_TOKEN is not initialized");
        }
        this.RESEND_TOKEN = process.env.RESEND_TOKEN;
    }
}

const configSingleton = () => {
    return new Config();
}

type ConfigSingleton = ReturnType<typeof configSingleton>

const globalForConfig = globalThis as unknown as {
    config: ConfigSingleton | undefined
}

export const config = globalForConfig.config ?? configSingleton();

if (process.env.NODE_ENV !== 'production') globalForConfig.config = config;