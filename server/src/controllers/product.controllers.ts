import { Product } from "../types/product";
import { Request, Response } from "express";
import { pgPool } from "../db/db.js";
import { deleteFromS3, uploadSingleImage } from "../middlewares/upload.js";
import { extractKeyFromS3Url } from "../utils/utils.js";


export const createProduct = async (req: Request, res: Response) => {
    let s3Key: string | null = null;
    try {
        const product: Product = req.body;
        const image = req.file;
        if (!product.name || !product.price || !product.description || !image) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const { url, key } = await uploadSingleImage(image);
        s3Key = key;

        const { rows } = await pgPool.query(
            "INSERT INTO products (name, price, description, product_image) VALUES ($1, $2, $3, $4) RETURNING *",
            [product.name, product.price, product.description, url]
        )
        res.status(201).json({
            message: "Product created successfully",
            data: rows[0]
        })
    } catch (error: unknown) {
        if (s3Key) {
            await deleteFromS3(s3Key);
        }
        console.error("Error in createProduct:", error);
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
    let newS3Key: string | null = null;
    try {
        const { id } = req.params;
        const image = req.file;

        const oldData = await pgPool.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        )
        if (!oldData.rows[0]) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        let imageUrl = oldData.rows[0].product_image;
        if (image) {
            const uploadImage = await uploadSingleImage(image);
            newS3Key = uploadImage.key;
            imageUrl = uploadImage.url;
        }

        const { rows } = await pgPool.query(
            "UPDATE products SET name = $1, price = $2, description = $3, product_image = $4 WHERE id = $5 RETURNING *",
            [req.body.name, req.body.price, req.body.description, imageUrl, id]
        )
        res.status(200).json({
            message: "Product updated successfully",
            data: rows[0]
        })
        if (image && oldData.rows[0].product_image) {
            const oldkey = extractKeyFromS3Url(oldData.rows[0].product_image);
            await deleteFromS3(oldkey);
        }
    } catch (error) {

        if (newS3Key) {
            await deleteFromS3(newS3Key);
        }
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
        if (rows[0].product_image) {
            const key = extractKeyFromS3Url(rows[0].product_image);
            console.log(key);
            await deleteFromS3(key);
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}