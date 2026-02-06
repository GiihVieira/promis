const API_URL = import.meta.env.VITE_API_URL;

export async function listPatients() {
  const res = await fetch(`${API_URL}/api/v1/patients`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao carregar pacientes");
  }

  return res.json();
}
