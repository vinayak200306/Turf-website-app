import { FIELD_DOOR_SPORTS } from "@fielddoor/shared";
import { pool } from "../src/config/db.js";
import { env } from "../src/config/env.js";

async function seed() {
  for (let index = 0; index < FIELD_DOOR_SPORTS.length; index += 1) {
    const sport = FIELD_DOOR_SPORTS[index];
    const sportResult = await pool.query<{ id: string }>(
      `insert into sports (
        slug,
        name,
        icon,
        description,
        price_per_hour,
        pricing_unit,
        image_url,
        display_order,
        rules_json,
        is_active
      ) values ($1,$2,$3,$4,$5,'hour',$6,$7,$8,true)
      on conflict (slug) do update
      set name = excluded.name,
          icon = excluded.icon,
          description = excluded.description,
          price_per_hour = excluded.price_per_hour,
          image_url = excluded.image_url,
          display_order = excluded.display_order,
          rules_json = excluded.rules_json
      returning id`,
      [sport.slug, sport.name, sport.icon, sport.description, sport.pricePerHour, sport.imagePath, index + 1, JSON.stringify(sport.rules)]
    );

    const sportId = sportResult.rows[0].id;

    for (let dayOffset = 0; dayOffset < 5; dayOffset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      const dateText = date.toISOString().slice(0, 10);

      for (let hour = 6; hour < 23; hour += 1) {
        const start = `${String(hour).padStart(2, "0")}:00`;
        const end = `${String(hour + 1).padStart(2, "0")}:00`;
        const rand = Math.random();
        const status = rand < 0.22 ? "booked" : rand < 0.35 ? "blocked" : "available";
        const adjustedPrice = sport.pricePerHour + (hour >= 17 ? 100 : 0);

        await pool.query(
          `insert into slots (sport_id, date, start_time, end_time, status, base_price)
          values ($1,$2,$3,$4,$5,$6)
          on conflict (sport_id, date, start_time, end_time) do nothing`,
          [sportId, dateText, start, end, status, adjustedPrice]
        );
      }
    }
  }

  await pool.query(
    `insert into users (phone, name, email, role)
    values ($1, 'Field Door Admin', 'owner@fielddoor.in', 'admin')
    on conflict (phone) do update
    set role = 'admin'`,
    [env.DEMO_ADMIN_PHONE]
  );

  console.log("Field Door seed complete");
  await pool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
