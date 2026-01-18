import { authMiddleware } from "../../../app/middlewares/auth.middleware";
import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  reactivatePatient,
} from "./patients.service";
import { validateCreatePatient } from "./patients.schema";

export function registerPatientRoutes(app: Hono<AppEnv>) {
  app.use("/api/v1/patients/*", authMiddleware);
  
  app.post("/api/v1/patients", async (c) => {
    const body = await c.req.json();
    const data = validateCreatePatient(body);

    const result = await createPatient(c.env.DB, data);

    return c.json(result, 201);
  });

  app.get("/api/v1/patients", async (c) => {
    const patients = await listPatients(c.env.DB);
    return c.json(patients);
  });

  app.get("/api/v1/patients/:id", async (c) => {
    const id = c.req.param("id");
    const patient = await getPatientById(c.env.DB, id);

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    return c.json(patient);
  });

  app.patch("/api/v1/patients/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();

    await updatePatient(c.env.DB, id, body);

    return c.json({ success: true });
  });

  app.delete("/api/v1/patients/:id", async (c) => {
    const id = c.req.param("id");

    await deletePatient(c.env.DB, id);

    return c.json({ success: true });
  });

  app.patch("/api/v1/patients/:id/reactivate", async (c) => {
    const id = c.req.param("id");

    const reactivated = await reactivatePatient(c.env.DB, id);

    if (!reactivated) {
      return c.json({ error: "Patient not found" }, 404);
    }

    return c.json({ success: true });
  });
}
