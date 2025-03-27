import express from "express";
import { executeDBQuery } from "../controllers/execute.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, executeDBQuery);

export default router;
