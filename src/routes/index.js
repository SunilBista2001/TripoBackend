import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import tourRoutes from "./tour.routes.js";

const router = Router();

router.use("/user", userRoutes);

router.use("/tours", tourRoutes);

router.use("/", authRoutes);

export default router;
