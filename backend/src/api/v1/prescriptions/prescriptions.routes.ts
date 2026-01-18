import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import { authMiddleware } from "../../../app/middlewares/auth.middleware";
import {
  createPrescription,
  getPrescriptionById,
  cancelPrescription,
  listPrescriptions,
} from "./prescriptions.service";
import { validateCreatePrescription } from "./prescriptions.schema";

export function registerPrescriptionRoutes(app: Hono<AppEnv>) {
  app.use("/api/v1/prescriptions/*", authMiddleware);

  app.post("/api/v1/prescriptions", async (c) => {
    const body = await c.req.json();
    const data = validateCreatePrescription(body);

    const user = c.get("user") as { sub: string };

    const result = await createPrescription(
      c.env.DB,
      data,
      user.sub
    );

    return c.json(result, 201);
  });

  app.get("/api/v1/prescriptions", async (c) => {
    const prescriptions = await listPrescriptions(c.env.DB);
    return c.json(prescriptions);
  });

  app.get("/api/v1/prescriptions/:id", async (c) => {
    const prescription = await getPrescriptionById(
      c.env.DB,
      c.req.param("id")
    );

    if (!prescription) {
      return c.json({ error: "Prescription not found" }, 404);
    }

    return c.json(prescription);
  });

  app.patch("/api/v1/prescriptions/:id/cancel", async (c) => {
    const { reason } = await c.req.json();

    if (!reason) {
      return c.json({ error: "Cancel reason is required" }, 400);
    }

    await cancelPrescription(c.env.DB, c.req.param("id"), reason);

    return c.json({ success: true });
  });
}
