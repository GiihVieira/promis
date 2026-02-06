const API_URL = import.meta.env.VITE_API_URL;

type PrescriptionItem = {
  medication_id: string;
  dosage: string;
};

export async function createPrescription(data: {
  patient_id: string;
  items: PrescriptionItem[];
}) {
  const res = await fetch(`${API_URL}/api/v1/prescriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Erro ao salvar receita");
  }

  return res.json();
}
