import express from "express";
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from "../controllers/product.controllers.js";
import { zodValidate } from "../middlewares/zodValidate.js";
import { createProductSchema } from "../schema/product.js";

const router = express.Router();

/* READ ALL */
router.get("/", getProducts);

/* CREATE */
router.post("/", zodValidate(createProductSchema), createProduct);

/* UPDATE */
router.put("/:id", zodValidate(createProductSchema), updateProduct);

/* DELETE */
router.delete("/:id", deleteProduct);

/* READ ONE */
router.get("/:id", getProductById);

export default router;
