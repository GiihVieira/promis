import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function HomeHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header
      style={{
        background: "linear-gradient(180deg, #32190F, #1f0f08)",
        padding: "20px 32px",
        color: "#fff",
        fontSize: 20,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>Promis Odontologia</span>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          background: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span className="material-icons" style={{ fontSize: 18 }}>
          logout
        </span>
        Sair
      </button>
    </header>
  );
}
