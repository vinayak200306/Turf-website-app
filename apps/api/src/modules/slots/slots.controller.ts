import type { Request, Response } from "express";
import { z } from "zod";
import { acquireSlotLock, getSlotsBySportAndDate, releaseSlotLock } from "./slots.service.js";

const getSlotsSchema = z.object({
  sportId: z.string().uuid(),
  date: z.string().min(1)
});

const lockSchema = z.object({
  slotId: z.string().uuid()
});

const releaseSchema = z.object({
  slotId: z.string().uuid(),
  lockToken: z.string().optional()
});

export async function getSlots(req: Request, res: Response) {
  const { sportId, date } = getSlotsSchema.parse(req.query);
  const slots = await getSlotsBySportAndDate(sportId, date);
  res.json({ success: true, data: slots });
}

export async function lockSelectedSlot(req: Request, res: Response) {
  const { slotId } = lockSchema.parse(req.body);
  const lock = await acquireSlotLock(slotId, req.user!.id);
  res.json({ success: true, data: { slotId, lockToken: lock.token, ttlSeconds: 600 } });
}

export async function releaseSelectedSlot(req: Request, res: Response) {
  const { slotId, lockToken } = releaseSchema.parse(req.body);
  await releaseSlotLock(slotId, lockToken);
  res.json({ success: true });
}
