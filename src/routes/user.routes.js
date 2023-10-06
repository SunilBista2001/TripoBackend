import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";

const router = Router();

router.get("/", userCtrl.getAllUsers);

router.get("/:id", userCtrl.getUser);

export default router;
