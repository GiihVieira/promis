import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["https://promis.pages.dev"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
