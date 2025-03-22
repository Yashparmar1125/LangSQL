import express from "express";

//validators imports
import {
  validateRegistration,
  validateLogin,
} from "../validators/auth.validator.js";
// import { singleUpload } from "../middlewares/multer.middleware.js";

//controllers imports
import {
  register,
  googleLogin,
  login,
  logout,
  googleRegister,
  githubRegister,
  githubLogin,
} from "../controllers/auth.controller.js";
const router = express.Router();


//routes
router.post("/register", validateRegistration, register);
router.post("/google/login", googleLogin);
router.post("/google/register", googleRegister);
router.post("/github/register", githubRegister);
router.post("/github/login", githubLogin);
router.post("/login", validateLogin, login);
router.get("/logout", logout);


export default router;
