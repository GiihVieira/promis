import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(loginValue, password);
      navigate("/");
    } catch {
      setError("Usuário/email ou senha inválidos");
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
              <label>Usuário ou email</label>
              <input
                type="text"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                required
              />
            </div>

            <div className="login-field password-field">
              <label>Senha</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="material-icons password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button className="login-button">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
