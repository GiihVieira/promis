import { useState } from "react";
import "./Home.css";
import Header from "../../components/Header";
import HomeTabs from "../../pages/home/tabs/HomeTab";
import PrescriptionTab from "./tabs/PrescriptionTab";
import PatientsTab from "./tabs/PatientsTab";
import MedicationsTab from "./tabs/MedicationsTab";

export type HomeTab = "prescription" | "patients" | "medications";

export default function Home() {
  const [activeTab, setActiveTab] = useState<HomeTab>("prescription");

  return (
    <div className="home-container">
      <Header />

      <div className="home-content">
        <HomeTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="home-card">
          {activeTab === "prescription" && <PrescriptionTab />}
          {activeTab === "patients" && <PatientsTab />}
          {activeTab === "medications" && <MedicationsTab />}
        </div>
      </div>
    </div>
  );
}
