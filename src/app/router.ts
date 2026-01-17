import { Hono } from "hono";
import type { AppEnv } from "./types";
import { registerDbTestRoutes } from "../api/v1/db-test.routes";
import { registerFrontend } from "./frontend";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { registerPatientRoutes } from "../api/v1/patients/patients.routes";
import { registerMedicationRoutes } from "../api/v1/medications/medications.routes";
import { registerUserRoutes } from "../api/v1/users/users.routes";
import { registerAuthRoutes } from "../api/v1/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { registerHealthRoutes } from "../api/v1/health.routes";

export function createApp() {
  const app = new Hono<AppEnv>();

  app.use("*", errorMiddleware);
  app.use("*", corsMiddleware);

  registerHealthRoutes(app);
  registerDbTestRoutes(app);
  registerPatientRoutes(app);
  registerUserRoutes(app);
  registerMedicationRoutes(app);
  registerAuthRoutes(app);
  registerFrontend(app);

  return app;
}
