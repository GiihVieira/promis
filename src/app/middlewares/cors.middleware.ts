import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: "*", // depois restringimos
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
});
