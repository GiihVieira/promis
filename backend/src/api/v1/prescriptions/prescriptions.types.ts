export type PrescriptionItem = {
  medication_name: string;
  posology: string;
};

export type Prescription = {
  id: string;
  patient_id: string;
  dentist_id: string;
  notes?: string | null;
  created_at: string;
  canceled_at?: string | null;
  cancel_reason?: string | null;
  items: PrescriptionItem[];
};
