import { apiFetch } from "./http";

export type Medication = {
  id: string;
  name: string;
  active_principle?: string;
  concentration?: string;
  form?: string;
  default_instructions?: string;
};

export async function listMedications(): Promise<Medication[]> {
  return apiFetch("/medications");
}

export async function createMedication(data: {
  name: string;
  active_principle?: string;
  concentration?: string;
  form?: string;
  default_instructions?: string;
}) {
  return apiFetch("/medications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteMedication(id: string) {
  return apiFetch(`/medications/${id}`, {
    method: "DELETE",
  });
}
