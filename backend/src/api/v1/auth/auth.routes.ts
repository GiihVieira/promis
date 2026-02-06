import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import { authenticateUser } from "./auth.service";
import { validateLogin } from "./auth.schema";

export function registerAuthRoutes(app: Hono<AppEnv>) {
  app.post("/api/v1/auth/login", async (c) => {
    if (!c.env.JWT_SECRET) {
      return c.json(
        { error: "JWT_SECRET not configured" },
        500
      );
    }

    try {
      const body = await c.req.json();
      const { login, password } = validateLogin(body);

      const result = await authenticateUser(
        c.env.DB,
        login,
        password,
        c.env.JWT_SECRET
      );

      return c.json(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";

      if (message === "Invalid credentials") {
        return c.json({ error: message }, 401);
      }

      return c.json({ error: "Internal server error" }, 500);
    }
  });
}
