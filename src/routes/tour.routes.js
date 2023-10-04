import { Router } from "express";
import * as tourCtrl from "../controllers/tour.controller.js";
import * as authCtrl from "../controllers/auth.controller.js";

const router = Router();

// only admin can create a tour
router.post(
  "/",
  authCtrl.requireAuth,
  authCtrl.authorizeTo("admin"),
  tourCtrl.createTour
);

// anyone can get all tours
router.get("/", tourCtrl.getAllTours);

// only logged in users can get a tour
router.get("/:id", authCtrl.requireAuth, tourCtrl.getTourById);

// only admin can update a tour
router.patch(
  "/:id",
  authCtrl.requireAuth,
  authCtrl.authorizeTo("admin"),
  tourCtrl.updateTourById
);

// only admin can delete a tour
router.delete(
  "/:id",
  authCtrl.requireAuth,
  authCtrl.authorizeTo("admin"),
  tourCtrl.deleteTour
);

export default router;
