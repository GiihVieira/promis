import type { Context, Next } from "hono";
import type { AppEnv } from "../types";
import { verifyJWT } from "../../shared/jwt";

export async function authMiddleware(
  c: Context<AppEnv>,
  next: Next
) {
  if (!c.env.JWT_SECRET) {
    return c.json(
      { error: "JWT_SECRET not configured" },
      500
    );
  }

  const auth = c.req.header("Authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = auth.slice(7);
  const payload = await verifyJWT(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({ error: "Invalid token" }, 401);
  }

  c.set("user", payload as AppEnv["Variables"]["user"]);
  await next();
}
