import express from "express"
import testConnection  from '../controllers/test.controller.js';
import validateConnectionDetails from '../middlewares/validation.middleware.js';

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/test',authMiddleware, validateConnectionDetails, testConnection);

export default router;
