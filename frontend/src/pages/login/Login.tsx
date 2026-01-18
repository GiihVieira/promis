import { type FormEvent, useState } from "react";
import "./login.css";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch {
      setError("Email ou senha inválidos");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-body">
          <h2>Bem-vindo</h2>
          <p>Acesse o sistema de receituário</p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Senha</label>
              <input
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="login-footer">
            © Promis Odontologia
          </div>
        </div>
      </div>
    </div>
  );
}
