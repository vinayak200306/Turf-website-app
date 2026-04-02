import type { Request, Response } from "express";
import { listSports } from "./sports.service.js";

export async function getSports(_req: Request, res: Response) {
  const sports = await listSports();

  res.json({
    success: true,
    data: sports
  });
}
