import { apiFetch } from "./http";

export type Patient = {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
};

export async function listPatients(): Promise<Patient[]> {
  return apiFetch("/patients");
}

export async function createPatient(data: {
  name: string;
  cpf: string;
  phone?: string;
}) {
  return apiFetch("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePatient(
  id: string,
  data: Partial<Omit<Patient, "id">>
) {
  return apiFetch(`/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePatient(id: string) {
  return apiFetch(`/patients/${id}`, {
    method: "DELETE",
  });
}
