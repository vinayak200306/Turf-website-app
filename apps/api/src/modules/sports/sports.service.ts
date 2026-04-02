import { query } from "../../config/db.js";
import type { SportRecord } from "@fielddoor/shared";

export async function listSports(): Promise<SportRecord[]> {
  const result = await query<SportRecord>(
    `select
      id,
      slug,
      name,
      icon,
      price_per_hour as "pricePerHour",
      description,
      pricing_unit as "pricingUnit",
      image_url as "imageUrl",
      is_active as "isActive",
      display_order as "displayOrder",
      rules_json as "rulesJson"
    from sports
    where is_active = true
    order by display_order asc`
  );

  return result.rows;
}
