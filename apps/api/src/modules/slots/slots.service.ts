import type { SlotAvailability } from "@fielddoor/shared";
import { query } from "../../config/db.js";
import { getSlotLock, lockSlot, releaseSlot } from "../../utils/slot-lock.js";
import { HttpError } from "../../utils/http-error.js";

interface SlotRow {
  id: string;
  sportId: string;
  sportName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "blocked";
  basePrice: number;
}

export async function getSlotsBySportAndDate(sportId: string, date: string): Promise<SlotAvailability[]> {
  const result = await query<SlotRow>(
    `select
      s.id,
      s.sport_id as "sportId",
      sp.name as "sportName",
      s.date::text as "date",
      to_char(s.start_time, 'HH24:MI') as "startTime",
      to_char(s.end_time, 'HH24:MI') as "endTime",
      s.status,
      s.base_price as "basePrice"
    from slots s
    inner join sports sp on sp.id = s.sport_id
    where s.sport_id = $1 and s.date = $2
    order by s.start_time asc`,
    [sportId, date]
  );

  const slots = await Promise.all(
    result.rows.map(async (slot) => {
      const activeLock = slot.status === "available" ? await getSlotLock(slot.id) : null;
      const isLocked = !!activeLock;

      return {
        ...slot,
        status: isLocked ? "locked" : slot.status,
        lockOwnerId: activeLock?.userId ?? null,
        urgencyLabel: slot.status === "available" && Math.random() > 0.65 ? "Only 2 slots left" : null
      } satisfies SlotAvailability;
    })
  );

  return slots;
}

export async function acquireSlotLock(slotId: string, userId: string) {
  const slot = await query<{ status: string }>(`select status from slots where id = $1 limit 1`, [slotId]);

  if (slot.rowCount === 0) {
    throw new HttpError(404, "Slot not found");
  }

  if (slot.rows[0].status !== "available") {
    throw new HttpError(409, "Slot is not available");
  }

  return lockSlot(slotId, userId);
}

export async function releaseSlotLock(slotId: string, token?: string) {
  await releaseSlot(slotId, token);
}
