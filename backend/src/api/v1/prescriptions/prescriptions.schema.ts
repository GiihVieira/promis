export type CreatePrescriptionItemInput = {
  medication_id: string;
  posology: string;
};

export type CreatePrescriptionInput = {
  patient_id: string;
  items: CreatePrescriptionItemInput[];
  notes?: string;
};

/**
 * Validate prescription creation payload.
 */
export function validateCreatePrescription(
  body: any
): CreatePrescriptionInput {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }

  if (!body.patient_id || typeof body.patient_id !== "string") {
    throw new Error("Invalid patient_id");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error("Prescription must have at least one item");
  }

  for (const item of body.items) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.medication_id !== "string" ||
      typeof item.posology !== "string" ||
      item.posology.trim().length === 0
    ) {
      throw new Error("Invalid prescription item");
    }
  }

  if (body.notes && typeof body.notes !== "string") {
    throw new Error("Invalid notes");
  }

  return {
    patient_id: body.patient_id,
    items: body.items,
    notes: body.notes,
  };
}
