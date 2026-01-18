import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import { authMiddleware } from "../../../app/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../../app/middlewares/admin.middleware";
import {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deactivateUser,
  reactivateUser,
} from "./users.service";
import {
  validateCreateUser,
  validateUpdateUser,
} from "./users.schema";

export function registerUserRoutes(app: Hono<AppEnv>) {
  app.use("/api/v1/users/*", authMiddleware, adminOnlyMiddleware);

  app.post("/api/v1/users", async (c) => {
    const body = await c.req.json();
    const data = validateCreateUser(body);

    const result = await createUser(c.env.DB, data);
    return c.json(result, 201);
  });

  app.get("/api/v1/users", async (c) => {
    const users = await listUsers(c.env.DB);
    return c.json(users);
  });

  app.get("/api/v1/users/:id", async (c) => {
    const user = await getUserById(c.env.DB, c.req.param("id"));

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  });

  app.patch("/api/v1/users/:id", async (c) => {
    const body = await c.req.json();
    const data = validateUpdateUser(body);

    await updateUser(c.env.DB, c.req.param("id"), data);
    return c.json({ success: true });
  });

  app.delete("/api/v1/users/:id", async (c) => {
    await deactivateUser(c.env.DB, c.req.param("id"));
    return c.json({ success: true });
  });

  app.patch("/api/v1/users/:id/reactivate", async (c) => {
    await reactivateUser(c.env.DB, c.req.param("id"));
    return c.json({ success: true });
  });
}
