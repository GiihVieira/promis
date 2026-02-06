const API_URL = import.meta.env.VITE_API_URL;

export async function listMedications() {
  const res = await fetch(`${API_URL}/api/v1/medications`, {
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Erro ao carregar medicamentos");
  }

  return res.json();
}
