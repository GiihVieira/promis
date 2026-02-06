import type { Context, Next } from "hono";
import type { AppEnv } from "../types";
import { verifyJWT } from "../../shared/jwt";

function getCookieValue(
  cookieHeader: string | null,
  key: string
) {
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === key) {
      return rest.join("=") || null;
    }
  }

  return null;
}

export async function authMiddleware(
  c: Context<AppEnv>,
  next: Next
) {
  const cookieHeader = c.req.header("Cookie");
  const sessionId = getCookieValue(cookieHeader, "session_id");

  if (sessionId) {
    const now = new Date().toISOString();
    const session = await c.env.DB.prepare(
      `
      SELECT
        u.id,
        u.email,
        u.role
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
        AND s.revoked_at IS NULL
        AND s.expires_at > ?
        AND u.is_active = 1
      LIMIT 1
    `
    )
      .bind(sessionId, now)
      .first<{
        id: string;
        email: string;
        role: "admin" | "user";
      }>();

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", {
      sub: session.id,
      email: session.email,
      role: session.role,
    });

    await next();
    return;
  }

  const auth = c.req.header("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    if (!c.env.JWT_SECRET) {
      return c.json(
        { error: "JWT_SECRET not configured" },
        500
      );
    }

    const token = auth.slice(7);
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ error: "Invalid token" }, 401);
    }

    c.set("user", payload as AppEnv["Variables"]["user"]);
    await next();
    return;
  }

  return c.json({ error: "Unauthorized" }, 401);
}
