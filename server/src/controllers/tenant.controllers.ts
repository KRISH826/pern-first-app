import { Request, Response } from "express";
import { pgPool } from "../db/db.js";

export const createTenant = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User information missing" });
        }
        const cognito_sub = req.user.id;
        const { name, email } = req.body;

        const existing = await pgPool.query(
            "SELECT 1 FROM tenants WHERE cognito_sub = $1",
            [cognito_sub]
        );

        if (existing.rows.length) {
            return res.status(409).json({ message: "Tenant already exists" });
        }

        const result = await pgPool.query(
            `INSERT INTO tenants (cognito_sub, name, email)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [cognito_sub, name, email]
        );

        return res.status(201).json({ data: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTenant = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User information missing" });
        }
        const cognito_sub = req.user.id;

        const result = await pgPool.query(
            "SELECT * FROM tenants WHERE cognito_sub = $1",
            [cognito_sub]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: "Tenant not found in DB" });
        }

        return res.status(200).json({ data: result.rows[0] });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
