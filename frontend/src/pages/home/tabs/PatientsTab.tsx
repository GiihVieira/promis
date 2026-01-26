import { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { listPatients } from "../../../api/patients";
import type { Patient } from "../types";

export default function PatientsTab() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  async function loadPatients() {
    const data = await listPatients();

    // 🔥 ajuste aqui se backend retornar nomes diferentes
    setPatients(
      data.map((p: any) => ({
        id: p.id,
        name: p.name,
        cpf: p.cpf,
        phone: p.phone,
      }))
    );
  }

  useEffect(() => {
    loadPatients().finally(() => setLoading(false));
  }, []);

  async function handleCreatePatient() {
    if (!name || !cpf) return;

    // TODO: Implement createPatient API call
    // await createPatient({
    //   name,
    //   cpf,
    //   phone,
    // });

    setName("");
    setCpf("");
    setPhone("");

    await loadPatients();
  }

  if (loading) {
    return <p>Carregando pacientes...</p>;
  }

  return (
    <div className="home-card">
      <div className="patients-section">
        <h2>Gerenciar Pacientes</h2>

        {/* FORM */}
        <div className="patients-form">
          <h3>Novo Paciente</h3>

          <div className="grid-3">
            <input
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />

            <input
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button onClick={handleCreatePatient} className="primary">
            + Adicionar Paciente
          </button>
        </div>

        {/* LISTA */}
        <div className="patient-list">
          {patients.map((p) => (
            <div key={p.id} className="patient-item">
              <div className="patient-info">
                <strong>{p.name}</strong>
                <span>
                  CPF: {p.cpf}
                  {p.phone && ` | Tel: ${p.phone}`}
                </span>
              </div>

              <div className="patient-actions">
                <button className="icon-btn edit">
                  <Edit2 size={18} />
                </button>
                <button className="icon-btn delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
