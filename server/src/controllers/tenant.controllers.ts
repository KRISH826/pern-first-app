import { Request, Response } from "express";
import { pgPool } from "../db/db.js";

export const createTenant = async (res: Response, req: Request) => {
    try {
        const { cognito_sub, name, email } = req.body;
        const existingTenant = await pgPool.query(
            "SELECT * FROM tenants WHERE cognito_sub = $1",
            [cognito_sub]
        )
        const tenant = await pgPool.query(
            "INSERT INTO tenants (cognito_sub, name, email) VALUES ($1, $2, $3) RETURNING *",
            [cognito_sub, name, email]
        )
        if (existingTenant.rows.length > 0) {
            return res.status(409).json({
                message: "Tenant already exists"
            })
        }
        if (!cognito_sub || !name || !email) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }
        return res.status(201).json({
            message: "Tenant created successfully",
            data: tenant.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getTenant = async (res: Response, req: Request) => {
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