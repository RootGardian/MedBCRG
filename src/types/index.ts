export type UserRole = 'MEDECIN' | 'INFIRMIER' | 'PHARMACIEN' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title: string;
}

export type PatientCategory = 'AGENT_BCRG' | 'AYANT_DROIT' | 'RETRAITE' | 'STAGIAIRE';

export interface Patient {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  phone: string;
  email?: string;
  category: PatientCategory;
  department?: string; // ex: Direction Informatique, Caisse Générale
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  createdAt: string;
}

export interface VitalSigns {
  tension?: string; // ex: "120/80"
  pulse?: number; // bpm
  temperature?: number; // °C
  weight?: number; // kg
  height?: number; // cm
  spo2?: number; // %
}

export interface PrescriptionItem {
  medicationId: string;
  medicationName: string;
  dosage: string;
  duration: string;
  quantity: number;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  patientMatricule: string;
  doctorId: string;
  doctorName: string;
  date: string;
  type: 'GENERAL' | 'URGENCE' | 'SUIVI' | 'VISITE_EMBAUCHE';
  symptoms: string;
  diagnosis: string;
  vitals: VitalSigns;
  prescriptions: PrescriptionItem[];
  notes?: string;
  status: 'TERMINEE' | 'EN_COURS' | 'EN_ATTENTE';
}

export interface Medication {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stockQuantity: number;
  minQuantityThreshold: number;
  expiryDate: string;
  location?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMatricule: string;
  doctorName: string;
  dateTime: string;
  reason: string;
  status: 'PROGRAMME' | 'CONFIRME' | 'ANNULE' | 'TERMINE';
}

export interface DashboardStats {
  consultationsToday: number;
  activePatients: number;
  lowStockAlerts: number;
  pendingAppointments: number;
}
