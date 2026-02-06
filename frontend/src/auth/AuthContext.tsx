import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, logoutRequest } from "../api/auth";

type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!active) return;

        if (!res.ok) {
          localStorage.removeItem("user");
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch {
        if (!active) return;
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  async function login(login: string, password: string) {
    const data = await loginRequest(login, password);

    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  }

  function logout() {
    logoutRequest().catch(() => undefined);
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
