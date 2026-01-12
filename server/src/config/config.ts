const {
    NODE_ENV,
    APP_NAME,
    PORT,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    DATABASE_URL,
    CORS_ORIGIN,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env;

function required(name: string, value?: string) {
    if (!value) {
        throw new Error(`❌ Missing required env variable: ${name}`);
    }
    return value;
}

function number(name: string, value: string | undefined, fallback: number) {
    const val = value ?? String(fallback);
    const num = Number(val);

    if (Number.isNaN(num)) {
        throw new Error(`❌ Env variable ${name} must be a number`);
    }

    return num;
}

const ENV = (NODE_ENV ?? "development") as
    | "development"
    | "staging"
    | "production";

export const config = Object.freeze({
    app: {
        name: APP_NAME ?? "node-enterprise-api",
        env: ENV,
        isProd: ENV === "production",
        port: number("PORT", PORT, 4000),
    },

    security: {
        jwt: {
            secret: required("JWT_SECRET", JWT_SECRET),
            expiresIn: JWT_EXPIRES_IN ?? "15m",
            refreshExpiresIn: JWT_REFRESH_EXPIRES_IN ?? "7d",
        },
    },

    database: {
        url: required("DATABASE_URL", DATABASE_URL),
    },

    cors: {
        origin: required("CORS_ORIGIN", CORS_ORIGIN),
        credentials: true,
    },
} as const);

