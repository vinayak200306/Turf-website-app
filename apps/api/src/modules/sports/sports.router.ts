import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { getSports } from "./sports.controller.js";

const router = Router();

router.get("/", asyncHandler(getSports));

export default router;
