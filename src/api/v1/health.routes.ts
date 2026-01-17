import { Hono } from "hono";
import type { AppEnv } from "../../app/types";

export function registerHealthRoutes(app: Hono<AppEnv>) {
  app.get("/api/v1/health", (c) => {
    return c.json({
      status: "ok",
      version: "v1",
      timestamp: new Date().toISOString(),
    });
  });
}
