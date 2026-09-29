import { Patient, Consultation, Medication, Appointment, DashboardStats } from '../types';

// Mock initial data for Infirmerie BCRG
const INITIAL_PATIENTS: Patient[] = [
  { id: 'PAT-001', matricule: '1001', firstName: 'Mamadou', lastName: 'Diallo', gender: 'M', birthDate: '1985-03-12', phone: '622-00-11-22', category: 'AGENT_BCRG', department: 'Direction Générale', bloodGroup: 'O+', allergies: [], chronicConditions: [], createdAt: '2024-01-15T00:00:00Z' },
  { id: 'PAT-002', matricule: '1002', firstName: 'Aïssatou', lastName: 'Camara', gender: 'F', birthDate: '1990-07-25', phone: '622-33-44-55', category: 'AGENT_BCRG', department: 'Direction Informatique', bloodGroup: 'A+', allergies: ['Pénicilline'], chronicConditions: [], createdAt: '2024-01-15T00:00:00Z' },
  { id: 'PAT-003', matricule: '1003', firstName: 'Ibrahima', lastName: 'Barry', gender: 'M', birthDate: '1978-11-08', phone: '622-66-77-88', category: 'AGENT_BCRG', department: 'Caisse Principale', bloodGroup: 'B+', allergies: [], chronicConditions: ['Hypertension'], createdAt: '2024-02-10T00:00:00Z' },
  { id: 'PAT-004', matricule: '1004', firstName: 'Fatoumata', lastName: 'Sylla', gender: 'F', birthDate: '1992-04-18', phone: '622-99-00-11', category: 'AGENT_BCRG', department: 'Ressources Humaines', bloodGroup: 'AB+', allergies: [], chronicConditions: [], createdAt: '2024-02-10T00:00:00Z' },
  { id: 'PAT-005', matricule: '1005', firstName: 'Fanta', lastName: 'Camara', gender: 'F', birthDate: '1988-09-02', phone: '622-22-33-44', category: 'AGENT_BCRG', department: 'Direction des Opérations', bloodGroup: 'O-', allergies: ['Aspirine'], chronicConditions: [], createdAt: '2024-03-05T00:00:00Z' },
  { id: 'PAT-006', matricule: '1006', firstName: 'Ousmane', lastName: 'Bangoura', gender: 'M', birthDate: '1983-01-30', phone: '622-55-66-77', category: 'AGENT_BCRG', department: 'Direction de la Comptabilité', bloodGroup: 'A-', allergies: [], chronicConditions: ['Diabète type 2'], createdAt: '2024-03-05T00:00:00Z' },
  { id: 'PAT-007', matricule: '1007', firstName: 'Mariama', lastName: 'Bah', gender: 'F', birthDate: '1995-06-14', phone: '622-88-99-00', category: 'AGENT_BCRG', department: 'Secrétariat Général', bloodGroup: 'B-', allergies: [], chronicConditions: [], createdAt: '2024-04-01T00:00:00Z' },
  { id: 'PAT-008', matricule: '1008', firstName: 'Abdoulaye', lastName: 'Condé', gender: 'M', birthDate: '1980-12-22', phone: '622-11-22-33', category: 'AGENT_BCRG', department: 'Direction de la Sécurité', bloodGroup: 'O+', allergies: [], chronicConditions: [], createdAt: '2024-04-01T00:00:00Z' },
  { id: 'PAT-009', matricule: '1009', firstName: 'Kadiatou', lastName: 'Sow', gender: 'F', birthDate: '1993-08-05', phone: '622-44-55-66', category: 'AYANT_DROIT', department: '', bloodGroup: 'A+', allergies: ['Arachides'], chronicConditions: [], createdAt: '2024-05-12T00:00:00Z' },
  { id: 'PAT-010', matricule: '1010', firstName: 'Mohamed', lastName: 'Touré', gender: 'M', birthDate: '1975-05-19', phone: '622-77-88-99', category: 'RETRAITE', department: 'Direction Générale', bloodGroup: 'AB-', allergies: [], chronicConditions: ['Hypertension', 'Arthrose'], createdAt: '2024-05-12T00:00:00Z' },
  { id: 'PAT-011', matricule: '1011', firstName: 'Sory', lastName: 'Keita', gender: 'M', birthDate: '1991-02-28', phone: '622-00-11-33', category: 'AGENT_BCRG', department: 'Direction Informatique', bloodGroup: 'O+', allergies: [], chronicConditions: [], createdAt: '2024-06-20T00:00:00Z' },
  { id: 'PAT-012', matricule: '1012', firstName: 'Hawa', lastName: 'Diakité', gender: 'F', birthDate: '1987-10-11', phone: '622-33-55-77', category: 'AGENT_BCRG', department: 'Direction des Études', bloodGroup: 'B+', allergies: [], chronicConditions: [], createdAt: '2024-06-20T00:00:00Z' },
  { id: 'PAT-013', matricule: '1013', firstName: 'Alpha', lastName: 'Baldé', gender: 'M', birthDate: '1982-07-03', phone: '622-66-88-00', category: 'AGENT_BCRG', department: 'Caisse Principale', bloodGroup: 'A+', allergies: ['Ibuprofène'], chronicConditions: [], createdAt: '2024-07-15T00:00:00Z' },
  { id: 'PAT-014', matricule: '1014', firstName: 'Nene', lastName: 'Diallo', gender: 'F', birthDate: '1996-03-27', phone: '622-99-11-22', category: 'STAGIAIRE', department: 'Ressources Humaines', bloodGroup: 'O-', allergies: [], chronicConditions: [], createdAt: '2024-07-15T00:00:00Z' },
  { id: 'PAT-015', matricule: '1015', firstName: 'Thierno', lastName: 'Diallo', gender: 'M', birthDate: '1989-11-16', phone: '622-22-44-66', category: 'AGENT_BCRG', department: 'Direction de l\'Audit', bloodGroup: 'AB+', allergies: [], chronicConditions: [], createdAt: '2024-08-01T00:00:00Z' },
];

const INITIAL_MEDICATIONS: Medication[] = [];

const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'CNS-2026-001',
    patientId: 'PAT-001',
    patientName: 'Mamadou Diallo',
    patientMatricule: 'MAT-2026-001',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Ousmane Bangoura',
    date: new Date().toISOString(),
    type: 'GENERAL',
    symptoms: 'Maux de tête persistants depuis 3 jours, légère fièvre.',
    diagnosis: 'Céphalée de tension et fatigue générale',
    vitals: { tension: '130/85', pulse: 78, temperature: 37.8, weight: 75, height: 178 },
    prescriptions: [
      { medicationId: 'MED-1', medicationName: 'Paracétamol 1000mg', dosage: '1 comprimé', duration: '3 jours', quantity: 1 }
    ],
    status: 'TERMINEE'
  },
  {
    id: 'CNS-2026-002',
    patientId: 'PAT-005',
    patientName: 'Fanta Camara',
    patientMatricule: 'MAT-2026-005',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Ousmane Bangoura',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'URGENCE',
    symptoms: 'Douleur aiguë au poignet droit suite à une chute.',
    diagnosis: 'Entorse légère du poignet',
    vitals: { tension: '125/80', pulse: 90, temperature: 36.7 },
    prescriptions: [],
    status: 'TERMINEE'
  }
];

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1001',
    patientId: 'PAT-001',
    patientName: 'Mamadou Diallo',
    patientMatricule: 'MAT-2026-001',
    doctorName: 'Dr. Ousmane Bangoura',
    dateTime: addDays(today, 0).toISOString().replace(/T.*/, 'T09:30:00.000Z'),
    reason: 'Consultation Générale',
    status: 'CONFIRME'
  },
  {
    id: 'APT-1002',
    patientId: 'PAT-002',
    patientName: 'Aïssatou Camara',
    patientMatricule: 'MAT-2026-002',
    doctorName: 'Dr. Ousmane Bangoura',
    dateTime: addDays(today, 0).toISOString().replace(/T.*/, 'T14:00:00.000Z'),
    reason: 'Visite d\'embauche',
    status: 'PROGRAMME'
  },
  {
    id: 'APT-1003',
    patientId: 'PAT-003',
    patientName: 'Ibrahima Barry',
    patientMatricule: 'MAT-2026-003',
    doctorName: 'Dr. Ousmane Bangoura',
    dateTime: addDays(today, 2).toISOString().replace(/T.*/, 'T10:15:00.000Z'),
    reason: 'Suivi tension artérielle',
    status: 'PROGRAMME'
  },
  {
    id: 'APT-1004',
    patientId: 'PAT-004',
    patientName: 'Fatoumata Sylla',
    patientMatricule: 'MAT-2026-004',
    doctorName: 'Dr. Ousmane Bangoura',
    dateTime: addDays(today, 5).toISOString().replace(/T.*/, 'T11:00:00.000Z'),
    reason: 'Consultation de routine',
    status: 'PROGRAMME'
  }
];

// Helper functions pour localStorage
const loadStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Erreur sauvegarde localStorage', err);
  }
};

export const apiService = {
  // Patients
  getPatients: (): Patient[] => loadStorage('bcrg_patients_v3', INITIAL_PATIENTS),
  savePatient: (patient: Omit<Patient, 'id' | 'createdAt'> & { id?: string }): Patient => {
    const patients = apiService.getPatients();
    if (patient.id) {
      const index = patients.findIndex((p) => p.id === patient.id);
      if (index !== -1) {
        patients[index] = { ...patients[index], ...patient };
        saveStorage('bcrg_patients_v3', patients);
        return patients[index];
      }
    }
    const newPatient: Patient = {
      ...patient,
      id: `PAT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    patients.unshift(newPatient);
    saveStorage('bcrg_patients_v3', patients);
    return newPatient;
  },

  // Consultations
  getConsultations: (): Consultation[] => loadStorage('bcrg_consultations_v3', INITIAL_CONSULTATIONS),
  addConsultation: (consultation: Omit<Consultation, 'id' | 'date'>): Consultation => {
    const list = apiService.getConsultations();
    const newConsultation: Consultation = {
      ...consultation,
      id: `CNS-${new Date().getFullYear()}-${(list.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
    };
    list.unshift(newConsultation);
    saveStorage('bcrg_consultations_v3', list);
    return newConsultation;
  },
  updateConsultation: (id: string, updates: Partial<Consultation>): Consultation | undefined => {
    const list = apiService.getConsultations();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    list[index] = { ...list[index], ...updates };
    saveStorage('bcrg_consultations_v3', list);
    return list[index];
  },

  // Pharmacie / Stock
  getMedications: (): Medication[] => loadStorage('bcrg_medications_v2', INITIAL_MEDICATIONS),
  saveMedication: (med: Omit<Medication, 'id'> & { id?: string }): Medication => {
    const list = apiService.getMedications();
    if (med.id) {
      const idx = list.findIndex((m) => m.id === med.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...med };
        saveStorage('bcrg_medications_v2', list);
        return list[idx];
      }
    }
    const newMed: Medication = {
      ...med,
      id: `MED-${Date.now().toString().slice(-4)}`,
    };
    list.push(newMed);
    saveStorage('bcrg_medications_v2', list);
    return newMed;
  },

  // Rendez-vous
  getAppointments: (): Appointment[] => loadStorage('bcrg_appointments_v4', INITIAL_APPOINTMENTS),
  addAppointment: (apt: Omit<Appointment, 'id'>): Appointment => {
    const list = apiService.getAppointments();
    const newApt: Appointment = {
      ...apt,
      id: `APT-${Date.now().toString().slice(-4)}`,
    };
    list.unshift(newApt);
    saveStorage('bcrg_appointments_v4', list);
    return newApt;
  },
  updateAppointment: (id: string, updates: Partial<Appointment>): Appointment | null => {
    const list = apiService.getAppointments();
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveStorage('bcrg_appointments_v4', list);
      return list[idx];
    }
    return null;
  },

  // Statistiques du Tableau de bord
  getDashboardStats: (): DashboardStats => {
    const patients = apiService.getPatients();
    const consultations = apiService.getConsultations();
    const medications = apiService.getMedications();
    const appointments = apiService.getAppointments();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayConsultations = consultations.filter((c) => c.date.startsWith(todayStr)).length;
    const lowStockCount = medications.filter((m) => m.stockQuantity <= m.minQuantityThreshold).length;

    return {
      consultationsToday: todayConsultations || consultations.length,
      activePatients: patients.length,
      lowStockAlerts: lowStockCount,
      pendingAppointments: appointments.filter((a) => a.status === 'PROGRAMME' || a.status === 'CONFIRME').length,
    };
  }
};
