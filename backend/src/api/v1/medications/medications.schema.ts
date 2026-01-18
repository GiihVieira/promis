export type CreateMedicationInput = {
  name: string;
  active_principle?: string;
  concentration?: string;
  form?: string;
  default_instructions?: string;
};

function normalizeOptionalString(value: any): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function validateCreateMedication(
  data: any
): CreateMedicationInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  if (typeof data.name !== "string" || data.name.trim().length === 0) {
    throw new Error("Name is required");
  }

  return {
    name: data.name.trim(),
    active_principle: normalizeOptionalString(data.active_principle),
    concentration: normalizeOptionalString(data.concentration),
    form: normalizeOptionalString(data.form),
    default_instructions: normalizeOptionalString(
      data.default_instructions
    ),
  };
}
