import { apiFetch } from "../api/http";

export async function login(email: string, password: string) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));

  return response.user;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
