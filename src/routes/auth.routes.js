import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", authController.register);

router.post("/login", authController.signIn);

export default router;
