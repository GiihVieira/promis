import { useEffect, useState } from "react";
import {
  listPatients,
  createPatient,
  deletePatient,
} from "../../api/patients.service";
import type { Patient } from "../../api/patients.service";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");

  async function load() {
    const data = await listPatients();
    setPatients(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!name || !cpf) return;

    await createPatient({ name, cpf });
    setName("");
    setCpf("");
    load();
  }

  async function handleDelete(id: string) {
    if (confirm("Excluir paciente?")) {
      await deletePatient(id);
      load();
    }
  }

  return (
    <div>
      <h3>Pacientes</h3>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <button onClick={handleCreate}>Adicionar</button>
      </div>

      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} — {p.cpf}{" "}
            <button onClick={() => handleDelete(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
