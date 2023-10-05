import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import tourRoutes from "./tour.routes.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

router.use("/user", userRoutes);

router.use("/tour", tourRoutes);

router.use("/reviews", reviewRoutes);

router.use("/", authRoutes);

export default router;
