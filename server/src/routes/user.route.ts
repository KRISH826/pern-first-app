import express from "express";
import { createTenant, getTenant } from "../controllers/tenant.controllers.js";
import { createManager, getManager } from "../controllers/manager.tenant.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ FIXED: Added / at the start of each route
router.get("/tenants/:cognito_sub", authMiddleware(["tenant"]), getTenant);
router.post("/tenants", authMiddleware(["tenant"]), createTenant);

router.get("/managers/:cognito_sub", authMiddleware(["manager"]), getManager);
router.post("/managers", authMiddleware(["manager"]), createManager);

export default router;