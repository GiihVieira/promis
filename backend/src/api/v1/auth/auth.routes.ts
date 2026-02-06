import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import { authenticateUser } from "./auth.service";
import { validateLogin } from "./auth.schema";

export function registerAuthRoutes(app: Hono<AppEnv>) {
  app.post("/api/v1/auth/login", async (c) => {
    const body = await c.req.json();
    const { login, password } = validateLogin(body);

    const result = await authenticateUser(
      c.env.DB,
      login,
      password,
      c.env.JWT_SECRET
    );

    return c.json(result);
  });
}
