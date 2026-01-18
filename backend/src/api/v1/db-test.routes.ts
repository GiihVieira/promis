import { Hono } from "hono";
import type { AppEnv } from "../../app/types";

export function registerDbTestRoutes(app: Hono<AppEnv>) {
  app.get("/api/v1/db-test", async (c) => {
    const result = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).all();

    return c.json(result.results);
  });
}
