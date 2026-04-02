import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { getSlots, lockSelectedSlot, releaseSelectedSlot } from "./slots.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { createRateLimiter } from "../../middleware/rate-limit.js";

const router = Router();

router.get("/", asyncHandler(getSlots));
router.post("/lock", requireAuth, createRateLimiter("slot-lock", 20, 60), asyncHandler(lockSelectedSlot));
router.post("/release", requireAuth, asyncHandler(releaseSelectedSlot));

export default router;
