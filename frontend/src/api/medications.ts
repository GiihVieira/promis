const API_URL = import.meta.env.VITE_API_URL;

export async function listMedications() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/v1/medications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao carregar medicamentos");
  }

  return res.json();
}
