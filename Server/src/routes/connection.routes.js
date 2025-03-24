import express from "express";
import {
  createConnection,
  deleteConnection,
  getConnection,
  updateConnection,
} from "../controllers/connection.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createConnection);
router.get("/", authMiddleware, getConnection);
router.put("/update/:id", authMiddleware, updateConnection);
router.delete("/delete/:id", authMiddleware, deleteConnection);

export default router;
