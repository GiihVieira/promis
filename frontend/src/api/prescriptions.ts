const API_URL = import.meta.env.VITE_API_URL;

type PrescriptionItem = {
  medication_id: string;
  dosage: string;
};

export async function createPrescription(data: {
  patient_id: string;
  items: PrescriptionItem[];
}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/v1/prescriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao salvar receita");
  }

  return res.json();
}
