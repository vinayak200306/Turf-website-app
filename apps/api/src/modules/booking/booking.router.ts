import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { cancelBookingController, createBookingIntentController, listUserBookingsController } from "./booking.controller.js";

const router = Router();

router.post("/create", requireAuth, asyncHandler(createBookingIntentController));
router.get("/user", requireAuth, asyncHandler(listUserBookingsController));
router.post("/cancel", requireAuth, asyncHandler(cancelBookingController));

export default router;
