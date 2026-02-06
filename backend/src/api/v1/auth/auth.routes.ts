import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import {
  authenticateUser,
  createSession,
  revokeSession,
} from "./auth.service";
import { validateLogin } from "./auth.schema";
import { authMiddleware } from "../../../app/middlewares/auth.middleware";

export function registerAuthRoutes(app: Hono<AppEnv>) {
  app.post("/api/v1/auth/login", async (c) => {
    try {
      const body = await c.req.json();
      const { login, password } = validateLogin(body);

      const result = await authenticateUser(
        c.env.DB,
        login,
        password
      );

      const session = await createSession(
        c.env.DB,
        result.user.id
      );

      const url = new URL(c.req.url);
      const secure = url.protocol === "https:";

      const cookie = [
        `session_id=${session.id}`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        `Max-Age=${session.maxAgeSeconds}`,
        secure ? "Secure" : null,
      ]
        .filter(Boolean)
        .join("; ");

      c.header("Set-Cookie", cookie);

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

  app.get("/api/v1/auth/me", authMiddleware, async (c) => {
    const user = c.get("user");

    const dbUser = await c.env.DB.prepare(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = ?
      LIMIT 1
    `
    )
      .bind(user.sub)
      .first<{ id: string; name: string; email: string; role: string }>();

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user: dbUser });
  });

  app.post("/api/v1/auth/logout", async (c) => {
    const cookieHeader = c.req.header("Cookie") ?? "";
    const sessionMatch = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("session_id="));

    if (sessionMatch) {
      const sessionId = sessionMatch.split("=")[1];
      if (sessionId) {
        await revokeSession(c.env.DB, sessionId);
      }
    }

    const url = new URL(c.req.url);
    const secure = url.protocol === "https:";
    const clearCookie = [
      "session_id=",
      "HttpOnly",
      "Path=/",
      "SameSite=Lax",
      "Max-Age=0",
      secure ? "Secure" : null,
    ]
      .filter(Boolean)
      .join("; ");

    c.header("Set-Cookie", clearCookie);
    return c.json({ success: true });
  });
}
