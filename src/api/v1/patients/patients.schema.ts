export type CreatePatientInput = {
  name: string;
  cpf: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  notes?: string;
};

export function validateCreatePatient(data: any): CreatePatientInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  const { name, cpf, birth_date, phone, email, notes } = data;

  if (!name || typeof name !== "string") {
    throw new Error("Name is required");
  }

  if (!cpf || typeof cpf !== "string") {
    throw new Error("CPF is required");
  }

  return {
    name,
    cpf,
    birth_date,
    phone,
    email,
    notes,
  };
}
