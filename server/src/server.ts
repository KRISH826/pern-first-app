import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/config.js";
import { connectDb, pgPool } from "./db/db.js";
import productRouter from "./routes/product.route.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(helmet());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/products", productRouter);
connectDb();
const server = app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});

const shutDown = async () => {
    console.log('shutting down...');
    server.close();
    await pgPool.end();
    process.exit(0);
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
