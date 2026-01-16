import { Request, Response } from "express";
import { pgPool } from "../db/db.js";

export const createTenant = async (req: Request, res: Response) => { // Fix: (req, res) not (res, req)
    try {
        const { cognito_sub, name, email } = req.body;

        // 1. Validation First
        if (!cognito_sub || !name || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check existence BEFORE inserting
        const existingTenant = await pgPool.query(
            "SELECT * FROM tenants WHERE cognito_sub = $1",
            [cognito_sub]
        );

        if (existingTenant.rows.length > 0) {
            return res.status(409).json({ message: "Tenant already exists" });
        }

        // 3. Finally, Insert
        const result = await pgPool.query(
            "INSERT INTO tenants (cognito_sub, name, email) VALUES ($1, $2, $3) RETURNING *",
            [cognito_sub, name, email]
        );

        return res.status(201).json({
            message: "Tenant created successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Database Error:", error); // Log the actual error to your terminal
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTenant = async (req: Request, res: Response) => {
    try {
        const { cognito_sub } = req.params;
        const tenant = await pgPool.query(
            "SELECT * FROM tenants WHERE cognito_sub = $1",
            [cognito_sub]
        )
        if (!tenant.rows.length) {
            return res.status(404).json({ message: "Tenant not found" })
        }
        return res.status(200).json({
            message: "Tenant found",
            data: tenant.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}