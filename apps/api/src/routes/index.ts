import { Router } from "express";
import authRouter from "../modules/auth/auth.router.js";
import sportsRouter from "../modules/sports/sports.router.js";
import slotsRouter from "../modules/slots/slots.router.js";
import bookingRouter from "../modules/booking/booking.router.js";
import paymentsRouter from "../modules/payments/payments.router.js";
import adminRouter from "../modules/admin/admin.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/sports", sportsRouter);
router.use("/slots", slotsRouter);
router.use("/bookings", bookingRouter);
router.use("/payments", paymentsRouter);
router.use("/admin", adminRouter);

export default router;
