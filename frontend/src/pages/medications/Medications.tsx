import { useEffect, useState } from "react";
import {
  listMedications,
  createMedication,
  deleteMedication,
} from "../../api/medications.service";
import type { Medication } from "../../api/medications.service";

export default function Medications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState("");
  const [concentration, setConcentration] = useState("");

  async function load() {
    const data = await listMedications();
    setMedications(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!name) return;

    await createMedication({
      name,
      concentration: concentration || undefined,
    });

    setName("");
    setConcentration("");
    load();
  }

  async function handleDelete(id: string) {
    if (confirm("Excluir medicamento?")) {
      await deleteMedication(id);
      load();
    }
  }

  return (
    <div>
      <h3>Medicamentos</h3>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Nome do medicamento"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Concentração (ex: 500mg)"
          value={concentration}
          onChange={(e) => setConcentration(e.target.value)}
        />
        <button onClick={handleCreate}>Adicionar</button>
      </div>

      <ul>
        {medications.map((m) => (
          <li key={m.id}>
            {m.name} {m.concentration && `(${m.concentration})`}{" "}
            <button onClick={() => handleDelete(m.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
