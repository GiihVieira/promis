export type Patient = {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
};


export type Medication = {
  id: string;
  name: string;
};

export type PrescriptionItem = {
  medication: Medication;
  posology: string;
};