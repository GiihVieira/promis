const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(login: string, password: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Credenciais inválidas");
  }

  return res.json();
}
