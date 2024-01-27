import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";
import * as authCtrl from "../controllers/auth.controller.js";
import * as algorithmCtrl from "../algorithm/index.js";
import { getRecommendation } from "../algorithm/algorithm.js";

const router = Router();

router.get("/users", userCtrl.getAllUsers);

router.get("/:id", userCtrl.getUser);

// Getting collaborative recommendation
router.get(
  "/",
  authCtrl.requireAuth,
  algorithmCtrl.getCollaborativeRecommendation
);
// router.get("/", authCtrl.requireAuth, getRecommendation);

export default router;
