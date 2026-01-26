import { useEffect, useState } from "react";
import { listPatients } from "../../../api/patients";
import { listMedications } from "../../../api/medications";
import type {
  Patient,
  Medication,
  PrescriptionItem,
} from "../types";

export default function PrescriptionTab() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const [patientId, setPatientId] = useState("");
  const [medicationId, setMedicationId] = useState("");
  const [posology, setPosology] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsData, medicationsData] =
          await Promise.all([
            listPatients(),
            listMedications(),
          ]);

        setPatients(
          patientsData.map((p: any) => ({
            id: p.id,
            name: p.name,
          }))
        );

        setMedications(
          medicationsData.map((m: any) => ({
            id: m.id,
            name: m.name,
          }))
        );
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function addItem() {
    if (!medicationId || !posology) return;

    const medication = medications.find(
      (m) => m.id === medicationId
    );

    if (!medication) return;

    setItems((prev) => [
      ...prev,
      { medication, posology },
    ]);

    setMedicationId("");
    setPosology("");
  }

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="card">
      <h2>Nova Receita</h2>
      <p className="subtitle">
        Preencha os dados da prescrição
      </p>

      {/* PACIENTE */}
      <div className="form-group">
        <label>Paciente</label>
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Selecione um paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* MEDICAMENTO */}
      <div className="box dashed">
        <h3>Adicionar Medicamento</h3>

        <div className="grid-2">
          <select
            value={medicationId}
            onChange={(e) =>
              setMedicationId(e.target.value)
            }
          >
            <option value="">
              Selecione um medicamento
            </option>
            {medications.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Ex: Tomar 1 comprimido a cada 8 horas"
            value={posology}
            onChange={(e) =>
              setPosology(e.target.value)
            }
          />
        </div>

        <button onClick={addItem}>
          Adicionar à Receita
        </button>
      </div>

      {/* ITENS */}
      {items.length > 0 && (
        <div className="list">
          {items.map((item, index) => (
            <div key={index} className="list-item">
              <strong>{item.medication.name}</strong>
              <span>{item.posology}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="primary"
        disabled={!patientId || items.length === 0}
      >
        Salvar Receita
      </button>
    </div>
  );
}
