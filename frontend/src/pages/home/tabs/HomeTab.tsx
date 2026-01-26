import type { HomeTab } from "../Home";

type Props = {
  activeTab: HomeTab;
  onChange: (tab: HomeTab) => void;
};

export default function HomeTabs({ activeTab, onChange }: Props) {
  return (
    <div className="home-tabs">
      <button
        className={`home-tab ${activeTab === "prescription" ? "active" : ""}`}
        onClick={() => onChange("prescription")}
      >
        Nova Receita
      </button>

      <button
        className={`home-tab ${activeTab === "patients" ? "active" : ""}`}
        onClick={() => onChange("patients")}
      >
        Pacientes
      </button>

      <button
        className={`home-tab ${activeTab === "medications" ? "active" : ""}`}
        onClick={() => onChange("medications")}
      >
        Medicamentos
      </button>
    </div>
  );
}
