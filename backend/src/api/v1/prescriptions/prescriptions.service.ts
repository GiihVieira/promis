import type { D1Database } from "@cloudflare/workers-types";
import type {
  CreatePrescriptionInput,
  CreatePrescriptionItemInput,
} from "./prescriptions.schema";
import type { Prescription } from "./prescriptions.types";

/**
 * Create a new prescription with selected patient, medications and free-text posology.
 */
export async function createPrescription(
  db: D1Database,
  data: CreatePrescriptionInput,
  dentistId: string
) {
  const prescriptionId = crypto.randomUUID();
  const now = new Date().toISOString();

  // ===== PRESCRIPTION HEADER =====
  await db
    .prepare(
      `
      INSERT INTO prescriptions (
        id,
        patient_id,
        dentist_id,
        notes,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .bind(
      prescriptionId,
      data.patient_id,
      dentistId,
      data.notes ?? null,
      now
    )
    .run();

  // ===== PRESCRIPTION ITEMS =====
  for (const item of data.items) {
    await insertPrescriptionItem(db, prescriptionId, item);
  }

  return { id: prescriptionId };
}

/**
 * Insert a single prescription item.
 * Fetches medication data and stores formatted name + concentration + free posology.
 */
async function insertPrescriptionItem(
  db: D1Database,
  prescriptionId: string,
  item: CreatePrescriptionItemInput
) {
  const medication = await db
    .prepare(
      `
      SELECT name, concentration
      FROM medications
      WHERE id = ?
      LIMIT 1
    `
    )
    .bind(item.medication_id)
    .first<{ name: string; concentration: string | null }>();

  if (!medication) {
    throw new Error("Medication not found");
  }

  // 🔒 PRESCRIPTION IS IMMUTABLE: freeze the final medication label here
  const medicationLabel = medication.concentration
    ? `${medication.name} ${medication.concentration}`
    : medication.name;

  await db
    .prepare(
      `
      INSERT INTO prescription_items (
        id,
        prescription_id,
        medication_name,
        posology
      )
      VALUES (?, ?, ?, ?)
    `
    )
    .bind(
      crypto.randomUUID(),
      prescriptionId,
      medicationLabel,
      item.posology
    )
    .run();
}

/**
 * Retrieve a prescription with its items.
 */
export async function getPrescriptionById(
  db: D1Database,
  id: string
): Promise<Prescription | null> {
  const prescription = await db
    .prepare(
      `
      SELECT
        id,
        patient_id,
        dentist_id,
        notes,
        created_at,
        canceled_at,
        cancel_reason
      FROM prescriptions
      WHERE id = ?
      LIMIT 1
    `
    )
    .bind(id)
    .first<any>();

  if (!prescription) return null;

  const items = await db
    .prepare(
      `
      SELECT
        medication_name,
        posology
      FROM prescription_items
      WHERE prescription_id = ?
      ORDER BY rowid ASC
    `
    )
    .bind(id)
    .all();

  return {
    ...prescription,
    items: items.results as Prescription["items"],
  };
}

/**
 * List all prescriptions.
 */
export async function listPrescriptions(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT
        id,
        patient_id,
        dentist_id,
        created_at,
        canceled_at,
        cancel_reason
      FROM prescriptions
      ORDER BY created_at DESC
    `
    )
    .all();

  return result.results;
}

/**
 * Cancel a prescription with a reason.
 */
export async function cancelPrescription(
  db: D1Database,
  id: string,
  reason: string
) {
  const now = new Date().toISOString();

  await db
    .prepare(
      `
      UPDATE prescriptions
      SET canceled_at = ?, cancel_reason = ?
      WHERE id = ? AND canceled_at IS NULL
    `
    )
    .bind(now, reason, id)
    .run();
}

/**
 * Retrieve dentist info for PDF rendering.
 */
export async function getDentistInfo(
  db: D1Database,
  dentistId: string
): Promise<{ name: string; cro: string | null } | null> {
  return db
    .prepare(
      `
      SELECT name, cro
      FROM users
      WHERE id = ?
      LIMIT 1
    `
    )
    .bind(dentistId)
    .first<{ name: string; cro: string | null }>();
}

/**
 * Retrieve patient info for PDF rendering.
 */
export async function getPatientInfo(
  db: D1Database,
  patientId: string
): Promise<{ name: string } | null> {
  return db
    .prepare(
      `
      SELECT name
      FROM patients
      WHERE id = ?
      LIMIT 1
    `
    )
    .bind(patientId)
    .first<{ name: string }>();
}
