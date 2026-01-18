import type { Hono } from "hono";
import type { AppEnv } from "./types";

export function registerFrontend(app: Hono<AppEnv>) {
  app.notFound((c) => {
    if (!c.env.ASSETS) {
      return c.text("Not Found", 404);
    }

    return c.env.ASSETS.fetch(c.req.raw);
  });
}
