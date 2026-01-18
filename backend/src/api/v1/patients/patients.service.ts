import type { D1Database } from "@cloudflare/workers-types";
import type { CreatePatientInput } from "./patients.schema";

export async function createPatient(
  db: D1Database,
  data: CreatePatientInput
) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO patients (
        id, name, cpf, birth_date, phone, email, notes, is_active, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `
    )
    .bind(
      id,
      data.name,
      data.cpf,
      data.birth_date ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.notes ?? null,
      now
    )
    .run();

  return { id };
}

export async function listPatients(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT *
      FROM patients
      WHERE is_active = 1
      ORDER BY created_at DESC
    `
    )
    .all();

  return result.results;
}

export async function getPatientById(db: D1Database, id: string) {
  const result = await db
    .prepare(
      `
      SELECT *
      FROM patients
      WHERE id = ? AND is_active = 1
      LIMIT 1
    `
    )
    .bind(id)
    .first();

  return result;
}

export async function updatePatient(
  db: D1Database,
  id: string,
  data: Partial<CreatePatientInput>
) {
  await db
    .prepare(
      `
      UPDATE patients
      SET
        name = COALESCE(?, name),
        cpf = COALESCE(?, cpf),
        birth_date = COALESCE(?, birth_date),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        notes = COALESCE(?, notes)
      WHERE id = ? AND is_active = 1
    `
    )
    .bind(
      data.name ?? null,
      data.cpf ?? null,
      data.birth_date ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.notes ?? null,
      id
    )
    .run();
}

export async function deletePatient(db: D1Database, id: string) {
  await db
    .prepare(
      `
      UPDATE patients
      SET is_active = 0
      WHERE id = ?
    `
    )
    .bind(id)
    .run();
}

export async function reactivatePatient(db: D1Database, id: string) {
  const result = await db
    .prepare(
      `
      UPDATE patients
      SET is_active = 1
      WHERE id = ?
    `
    )
    .bind(id)
    .run();

  return result.meta.changes > 0;
}
