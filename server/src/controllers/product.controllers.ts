import { Product } from "../types/product";
import { Request, Response } from "express";
import { pgPool } from "../db/db.js";


export const createProduct = async (req: Request, res: Response) => {
    try {
        const product: Product = req.body;
        const { rows } = await pgPool.query(
            "INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *",
            [product.name, product.price, product.description]
        )
        res.status(201).json({
            message: "Product created successfully",
            data: rows[0]
        })
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { rows } = await pgPool.query("SELECT * FROM products")
        res.status(200).json({
            message: "Products fetched successfully",
            data: rows
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rows } = await pgPool.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        )
        res.status(200).json({
            message: "Product fetched successfully",
            data: rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rows } = await pgPool.query(
            "UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *",
            [req.body.name, req.body.price, req.body.description, id]
        )
        res.status(200).json({
            message: "Product updated successfully",
            data: rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rows } = await pgPool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        )
        res.status(200).json({
            message: "Product deleted successfully",
            data: rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}