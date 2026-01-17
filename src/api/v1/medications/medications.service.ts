import type { D1Database } from "@cloudflare/workers-types";
import type { CreateMedicationInput } from "./medications.schema";

export async function createMedication(
  db: D1Database,
  data: CreateMedicationInput
) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO medications (
        id,
        name,
        active_principle,
        concentration,
        form,
        default_instructions,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    )
    .bind(
      id,
      data.name,
      data.active_principle ?? null,
      data.concentration ?? null,
      data.form ?? null,
      data.default_instructions ?? null,
      now
    )
    .run();

  return { id };
}

export async function listMedications(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT *
      FROM medications
      ORDER BY name ASC
    `
    )
    .all();

  return result.results;
}

export async function getMedicationById(db: D1Database, id: string) {
  return db
    .prepare(
      `
      SELECT *
      FROM medications
      WHERE id = ?
      LIMIT 1
    `
    )
    .bind(id)
    .first();
}

export async function updateMedication(
  db: D1Database,
  id: string,
  data: Partial<CreateMedicationInput>
) {
  await db
    .prepare(
      `
      UPDATE medications
      SET
        name = COALESCE(?, name),
        active_principle = COALESCE(?, active_principle),
        concentration = COALESCE(?, concentration),
        form = COALESCE(?, form),
        default_instructions = COALESCE(?, default_instructions)
      WHERE id = ?
    `
    )
    .bind(
      data.name ?? null,
      data.active_principle ?? null,
      data.concentration ?? null,
      data.form ?? null,
      data.default_instructions ?? null,
      id
    )
    .run();
}

export async function deleteMedication(db: D1Database, id: string) {
  await db
    .prepare(
      `
      DELETE FROM medications
      WHERE id = ?
    `
    )
    .bind(id)
    .run();
}
