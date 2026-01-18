import type { Context, Next } from "hono";

export async function adminOnlyMiddleware(c: Context, next: Next) {
  const user = c.get("user") as { role?: string };

  if (!user || user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
}
