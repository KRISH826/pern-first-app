import { Request, Response } from "express";
import { pgPool } from "../db/db.js";

export const createManager = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User information missing" });
        }
        const cognito_sub = req.user.id;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingManager = await pgPool.query(
            "SELECT * FROM managers WHERE cognito_sub = $1",
            [cognito_sub]
        );

        if (existingManager.rows.length > 0) {
            return res.status(409).json({ message: "Manager already exists" });
        }

        const manager = await pgPool.query(
            "INSERT INTO managers (cognito_sub, name, email) VALUES ($1, $2, $3) RETURNING *",
            [cognito_sub, name, email]
        );

        return res.status(201).json({
            message: "Manager created successfully",
            data: manager.rows[0]
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getManager = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User information missing" });
        }
        const cognito_sub = req.user.id;

        const manager = await pgPool.query(
            "SELECT * FROM managers WHERE cognito_sub = $1",
            [cognito_sub]
        );

        if (manager.rows.length > 0) {
            return res.status(200).json({
                message: "Manager found",
                data: manager.rows[0],
            });
        }

        const newManager = await pgPool.query(
            "INSERT INTO managers (cognito_sub) VALUES ($1) RETURNING *",
            [cognito_sub]
        );

        return res.status(201).json({
            message: "Manager auto-created",
            data: newManager.rows[0],
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

