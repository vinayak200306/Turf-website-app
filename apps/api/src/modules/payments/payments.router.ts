import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createOrderController, paymentWebhookController, verifyPaymentController } from "./payments.controller.js";

const router = Router();

router.post("/create-order", requireAuth, asyncHandler(createOrderController));
router.post("/verify", requireAuth, asyncHandler(verifyPaymentController));
router.post("/webhook", asyncHandler(paymentWebhookController));

export default router;
