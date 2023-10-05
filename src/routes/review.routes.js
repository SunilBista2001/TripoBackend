import { Router } from "express";
import * as reviewCtrl from "../controllers/review.controller.js";
import * as authCtrl from "../controllers/auth.controller.js";

const router = Router();

router.post("/", authCtrl.requireAuth, reviewCtrl.addReview);

router.get("/", reviewCtrl.getAllReviews);

router.patch("/:id", authCtrl.requireAuth, reviewCtrl.updateReview);

router.delete("/:id", authCtrl.requireAuth, reviewCtrl.deleteReview);

export default router;
