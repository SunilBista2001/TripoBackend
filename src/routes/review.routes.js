import { Router } from "express";
import * as reviewCtrl from "../controllers/review.controller.js";
import * as authCtrl from "../controllers/auth.controller.js";

const router = Router();

router.post("/", authCtrl.requireAuth, reviewCtrl.addReview);

router.get("/", reviewCtrl.getAllReviews);

export default router;
