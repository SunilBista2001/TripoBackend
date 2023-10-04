import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.get("/", authController.requireAuth, (req, res) => {
  res.json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

export default router;
