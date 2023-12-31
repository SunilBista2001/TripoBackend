import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller.js";
import * as userCtrl from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", authCtrl.register);

router.post("/login", authCtrl.signIn);

router.get("/me", authCtrl.requireAuth, authCtrl.getMe, userCtrl.getUser);

router.patch(
  "/updateMe",
  authCtrl.requireAuth,
  authCtrl.upload.single("profilePicture"),
  authCtrl.resizeProfilePicture,
  authCtrl.updateMe
);

export default router;
