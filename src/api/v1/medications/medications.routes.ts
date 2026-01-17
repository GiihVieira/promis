import { authMiddleware } from "../../../app/middlewares/auth.middleware";
import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import {
  createMedication,
  listMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} from "./medications.service";
import { validateCreateMedication } from "./medications.schema";

export function registerMedicationRoutes(app: Hono<AppEnv>) {
  app.use("/api/v1/medications/*", authMiddleware);

  app.post("/api/v1/medications", async (c) => {
    const body = await c.req.json();
    const data = validateCreateMedication(body);

    const result = await createMedication(c.env.DB, data);

    return c.json(result, 201);
  });

  app.get("/api/v1/medications", async (c) => {
    const medications = await listMedications(c.env.DB);
    return c.json(medications);
  });

  app.get("/api/v1/medications/:id", async (c) => {
    const id = c.req.param("id");
    const medication = await getMedicationById(c.env.DB, id);

    if (!medication) {
      return c.json({ error: "Medication not found" }, 404);
    }

    return c.json(medication);
  });

  app.patch("/api/v1/medications/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();

    await updateMedication(c.env.DB, id, body);

    return c.json({ success: true });
  });

  app.delete("/api/v1/medications/:id", async (c) => {
    const id = c.req.param("id");

    await deleteMedication(c.env.DB, id);

    return c.json({ deleted: true });
  });
}
