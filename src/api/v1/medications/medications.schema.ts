export type CreateMedicationInput = {
  name: string;
  active_principle?: string;
  concentration?: string;
  form?: string;
  default_instructions?: string;
};

export function validateCreateMedication(data: any): CreateMedicationInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  const {
    name,
    active_principle,
    concentration,
    form,
    default_instructions,
  } = data;

  if (!name || typeof name !== "string") {
    throw new Error("Name is required");
  }

  return {
    name,
    active_principle,
    concentration,
    form,
    default_instructions,
  };
}
