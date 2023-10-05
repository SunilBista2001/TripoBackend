import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";

const router = Router();

router.get("/", userCtrl.getAllUsers);

export default router;
