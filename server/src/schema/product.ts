import { z } from "zod";
import { pgPool } from "../db/db.js";

export const createProductSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .min(5, { message: "Name must be at least 2 characters long" })
        .refine(async (name) => {
            const { rows } = await pgPool.query("SELECT * FROM products WHERE name = $1", [name]);
            return rows.length === 0;
        }, { message: "Product with this name already exists" }),

    product_image: z.string({ message: "Product image is required" }).min(5, { message: 'Product image must be at least 5 characters long' }),

    description: z
        .string({ message: "Description is required" })
        .min(10, { message: "Description must be at least 5 characters long" }),

    price: z.coerce
        .number({ message: "Price is required" })
        .positive({ message: "Price must be greater than 0" }),
});