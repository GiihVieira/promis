import { FileText, Users, Pill } from "lucide-react";
import type { HomeTab } from "./Home";

type Props = {
  activeTab: HomeTab;
  onChange: (tab: HomeTab) => void;
};

export default function HomeTabs({ activeTab, onChange }: Props) {
  return (
    <div className="home-tabs">
      <Tab
        label="Nova Receita"
        icon={<FileText size={18} />}
        active={activeTab === "prescription"}
        onClick={() => onChange("prescription")}
      />
      <Tab
        label="Pacientes"
        icon={<Users size={18} />}
        active={activeTab === "patients"}
        onClick={() => onChange("patients")}
      />
      <Tab
        label="Medicamentos"
        icon={<Pill size={18} />}
        active={activeTab === "medications"}
        onClick={() => onChange("medications")}
      />
    </div>
  );
}

function Tab({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`home-tab ${active ? "active" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}
