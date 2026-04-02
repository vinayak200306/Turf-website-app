import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  analyticsController,
  blockDateController,
  bookingsController,
  createSlotController,
  deleteSlotController,
  updateSlotController
} from "./admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/analytics", asyncHandler(analyticsController));
router.get("/bookings", asyncHandler(bookingsController));
router.post("/slots/create", asyncHandler(createSlotController));
router.patch("/slots/update", asyncHandler(updateSlotController));
router.delete("/slots/delete", asyncHandler(deleteSlotController));
router.post("/blocked-dates", asyncHandler(blockDateController));

export default router;
