import express from "express";
import { executeQuery } from "../controllers/execute.controller.js";

const router = express.Router();

router.post("/execute", executeQuery);

export default router;
