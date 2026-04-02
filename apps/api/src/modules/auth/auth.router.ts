import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { createRateLimiter } from "../../middleware/rate-limit.js";
import { logoutController, refreshController, sendOtpController, verifyOtpController } from "./auth.controller.js";

const router = Router();

router.post("/send-otp", createRateLimiter("auth-send-otp", 5, 60), asyncHandler(sendOtpController));
router.post("/verify-otp", createRateLimiter("auth-verify-otp", 10, 60), asyncHandler(verifyOtpController));
router.post("/refresh", asyncHandler(refreshController));
router.post("/logout", asyncHandler(logoutController));

export default router;
