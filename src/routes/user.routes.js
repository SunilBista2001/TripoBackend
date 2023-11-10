import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";
import * as authCtrl from "../controllers/auth.controller.js";
import * as algorithmCtrl from "../algorithm/index.js";

const router = Router();

router.get("/", userCtrl.getAllUsers);

router.get("/:id", userCtrl.getUser);

router.get("/recommendation/:id", algorithmCtrl.getCollaborativeRecommendation);

export default router;
