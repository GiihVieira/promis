import { useAuth } from "./auth/AuthContext";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Dashboard /> : <Login />;
}
