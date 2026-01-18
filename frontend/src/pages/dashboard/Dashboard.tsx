import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import Patients from "../patients/Patients";
import Medications from "../medications/Medications";

type Page = "home" | "patients" | "medications";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [page, setPage] = useState<Page>("home");

    return (
        <div style={{ padding: 24 }}>
            <header style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Promis Odontologia</h2>

                <div>
                    <span>{user?.name}</span>{" "}
                    <button onClick={logout}>Sair</button>
                </div>
            </header>

            <hr />

            {/* MENU */}
            <nav style={{ marginBottom: 16 }}>
                <button onClick={() => setPage("home")}>Início</button>
                <button onClick={() => setPage("patients")}>Pacientes</button>
                <button onClick={() => setPage("medications")}>Medicamentos</button>
            </nav>


            <main>
                {page === "home" && (
                    <>
                        <h3>Bem-vindo ao sistema</h3>
                        <p>Escolha uma opção no menu.</p>
                    </>
                )}

                {page === "patients" && <Patients />}

                {page === "medications" && <Medications />}

            </main>
        </div>
    );
}
