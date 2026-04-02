import { nanoid } from "nanoid";
import redis from "../config/redis.js";
import { env } from "../config/env.js";
import { HttpError } from "./http-error.js";

interface SlotLockPayload {
  userId: string;
  token: string;
}

function getLockKey(slotId: string) {
  return `lock:slot:${slotId}`;
}

export async function lockSlot(slotId: string, userId: string) {
  const payload: SlotLockPayload = {
    userId,
    token: nanoid(24)
  };

  const wasSet = await redis.set(getLockKey(slotId), JSON.stringify(payload), "EX", env.SLOT_LOCK_TTL_SECONDS, "NX");

  if (!wasSet) {
    throw new HttpError(409, "Slot already locked");
  }

  return payload;
}

export async function getSlotLock(slotId: string): Promise<SlotLockPayload | null> {
  const raw = await redis.get(getLockKey(slotId));
  return raw ? (JSON.parse(raw) as SlotLockPayload) : null;
}

export async function assertSlotLock(slotId: string, userId: string, token: string) {
  const lock = await getSlotLock(slotId);

  if (!lock || lock.userId !== userId || lock.token !== token) {
    throw new HttpError(409, "Slot lock is invalid or expired");
  }

  return lock;
}

export async function releaseSlot(slotId: string, token?: string) {
  if (!token) {
    await redis.del(getLockKey(slotId));
    return;
  }

  const current = await getSlotLock(slotId);

  if (current && current.token === token) {
    await redis.del(getLockKey(slotId));
  }
}
