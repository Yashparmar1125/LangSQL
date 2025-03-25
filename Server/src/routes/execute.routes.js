import express from "express";
import { executeDBQuery } from "../controllers/execute.controller.js";

const router = express.Router();

router.post("/", executeDBQuery);

export default router;
