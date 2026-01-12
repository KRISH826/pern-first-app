import { Pool } from "pg";
import { config } from "../config/config.js";

export const pgPool = new Pool({
    connectionString: config.database.url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export const connectDb = () => {
    pgPool.connect((err) => {
        if (err) {
            console.error("❌ Postgres connection error:", err);
            process.exit(1);
        }
        console.log("✅ Postgres connection established");
    })
    try {
        pgPool.on("connect", () => {
            console.log("✅ Postgres connection established");
        })
    } catch (error) {
        console.error("❌ Postgres pool error:", error);
        process.exit(1);
    }
}
