import express from "express";
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* READ ALL */
router.get("/", getProducts);

/* CREATE */
router.post("/", upload.single("product_image"), createProduct);

/* UPDATE */
router.put("/:id", upload.single("product_image"), updateProduct);

/* DELETE */
router.delete("/:id", deleteProduct);

/* READ ONE */
router.get("/:id", getProductById);

export default router;
