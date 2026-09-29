import React, { useState, useEffect } from 'react';
import { Stethoscope, Plus, Search, Filter, ChevronDown, User, Activity, Clock, MoreHorizontal, FileText, X, Heart, Pill, CheckCircle, AlertTriangle, Droplets, Thermometer, Weight, Ruler, Printer } from 'lucide-react';
import { Consultation, Patient, PrescriptionItem } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import { CONSULTATION_TYPES_LABEL } from '../../utils/constants';
import { useNotifications } from '../../hooks/useNotifications';

export const ConsultationsPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Patient autocomplete state
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Detail panel state
  const [openConsultation, setOpenConsultation] = useState<Consultation | null>(null);
  const [detailTab, setDetailTab] = useState<'dossier' | 'consultation' | 'ordonnance'>('consultation');
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedDuration, setNewMedDuration] = useState('');

  // Vitals state for real-time IMC
  const [modalWeight, setModalWeight] = useState('');
  const [modalHeight, setModalHeight] = useState('');

  // Helper for IMC
  const getImcStatus = (imc: number) => {
    if (imc < 18.5) return { label: 'Insuffisance', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' };
    if (imc < 25) return { label: 'Normal', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' };
    if (imc < 30) return { label: 'Surpoids', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' };
    return { label: 'Obésité', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' };
  };

  const calculateImc = (weight?: number, height?: number) => {
    if (!weight || !height) return null;
    return Number((weight / Math.pow(height / 100, 2)).toFixed(1));
  };

  useEffect(() => {
    setConsultations(apiService.getConsultations());
    setAllPatients(apiService.getPatients());
  }, []);

  const filteredPatients = patientSearch.length >= 1
    ? allPatients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.matricule.includes(patientSearch)
    ).slice(0, 8)
    : [];

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.firstName} ${patient.lastName} — ${patient.matricule}`);
    setShowPatientDropdown(false);
  };

  const handleOpenConsultation = (consultation: Consultation) => {
    setOpenConsultation(consultation);
    setEditDiagnosis(consultation.diagnosis || '');
    setEditNotes(consultation.notes || '');
    setDetailTab('consultation');
    setActiveMenu(null);
  };

  const getPatientForConsultation = (c: Consultation) => {
    return allPatients.find(p => p.id === c.patientId || p.matricule === c.patientMatricule);
  };

  const handleSaveDiagnosis = () => {
    if (!openConsultation) return;
    
    // Save to DB
    apiService.updateConsultation(openConsultation.id, { 
      diagnosis: editDiagnosis, 
      notes: editNotes 
    });

    // Update local state
    const updated = consultations.map(c => c.id === openConsultation.id
      ? { ...c, diagnosis: editDiagnosis, notes: editNotes }
      : c
    );
    setConsultations(updated);
    setOpenConsultation({ ...openConsultation, diagnosis: editDiagnosis, notes: editNotes });
    showToast('Succès', 'Le diagnostic a été enregistré.', 'success');
  };

  const handleUpdateBloodGroup = (bloodGroup: string) => {
    if (!openConsultation) return;
    const patient = getPatientForConsultation(openConsultation);
    if (!patient) return;

    // Save to DB
    apiService.savePatient({ ...patient, bloodGroup });

    // Refresh local state
    setAllPatients(apiService.getPatients());
  };

  const handleAddPrescription = () => {
    if (!openConsultation || !newMedName) return;
    const newPrescription: PrescriptionItem = {
      medicationId: `MED-${Date.now()}`,
      medicationName: newMedName,
      dosage: newMedDosage,
      duration: newMedDuration,
      quantity: 1,
    };
    const updatedConsultation = {
      ...openConsultation,
      prescriptions: [...openConsultation.prescriptions, newPrescription]
    };
    
    // Save to DB
    apiService.updateConsultation(openConsultation.id, {
      prescriptions: updatedConsultation.prescriptions
    });

    const updated = consultations.map(c => c.id === openConsultation.id ? updatedConsultation : c);
    setConsultations(updated);
    setOpenConsultation(updatedConsultation);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedDuration('');
  };

  const handleTerminerConsultation = () => {
    if (!openConsultation) return;
    
    // Save to DB
    apiService.updateConsultation(openConsultation.id, { 
      diagnosis: editDiagnosis, 
      notes: editNotes, 
      status: 'TERMINEE' 
    });

    const updatedConsultation = { ...openConsultation, diagnosis: editDiagnosis, notes: editNotes, status: 'TERMINEE' as const };
    const updated = consultations.map(c => c.id === openConsultation.id ? updatedConsultation : c);
    setConsultations(updated);
    setOpenConsultation(null);
    showToast('Consultation terminée', 'La consultation a été clôturée et enregistrée.', 'success');
  };

  const handleStartConsultation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const formData = new FormData(e.currentTarget);

    const newConsultation = apiService.addConsultation({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientMatricule: selectedPatient.matricule,
      doctorId: 'DOC-01',
      doctorName: 'Dr. Ousmane Bangoura',
      type: formData.get('type') as any,
      symptoms: formData.get('symptoms') as string,
      diagnosis: formData.get('diagnosis') as string || '',
      vitals: {
        tension: formData.get('tension') as string,
        temperature: Number(formData.get('temperature')) || undefined,
        weight: Number(modalWeight) || undefined,
        height: Number(modalHeight) || undefined,
      },
      prescriptions: [],
      status: 'EN_COURS'
    });

    setConsultations([newConsultation, ...consultations]);
    setIsModalOpen(false);
    setSelectedPatient(null);
    setPatientSearch('');
    setModalWeight('');
    setModalHeight('');
  };

  const filtered = consultations.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.patientMatricule.toLowerCase().includes(search.toLowerCase()) ||
    c.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
            <Stethoscope className="w-7 h-7 text-[#0f172a]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Consultations</h1>
            <p className="text-slate-500 mt-1 text-sm">Gérez l'historique des visites médicales et urgences.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1b3b31] hover:bg-[#142c24] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Consultation</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Consultations ce mois</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">{consultations.length}</div>
          <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-md self-start">
            Ce mois
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Urgences récentes</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">{consultations.filter(c => c.type === 'URGENCE').length}</div>
          <div className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md self-start">
            Urgences
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">En attente / En cours</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">{consultations.filter(c => c.status !== 'TERMINEE').length}</div>
          <div className="inline-block px-2 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-md self-start">
            Aujourd'hui
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher (patient, matricule, diagnostic)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:bg-white focus:border-[#1b3b31] focus:ring-2 focus:ring-[#1b3b31]/20 rounded-xl outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Date
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Date & Heure</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Diagnostic Rapide</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{c.patientName}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">{c.patientMatricule}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{formatDate(c.date)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{new Date(c.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.type === 'URGENCE' ? 'danger' : c.type === 'GENERAL' ? 'info' : 'default'}>
                      {CONSULTATION_TYPES_LABEL[c.type]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 max-w-[200px] truncate font-medium">
                      {c.diagnosis || <span className="text-slate-400 italic">Non renseigné</span>}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                      {c.symptoms}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.status === 'TERMINEE' ? 'success' : c.status === 'EN_COURS' ? 'warning' : 'default'}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)}
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {activeMenu === c.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => handleOpenConsultation(c)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 transition-colors">
                              <FileText className="w-4 h-4" />
                              Ouvrir le dossier
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Stethoscope className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Aucune consultation trouvée.</p>
                      <p className="text-slate-400 text-sm mt-1">Modifiez vos filtres ou créez une nouvelle consultation.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle Consultation (Simplified) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Démarrer une consultation</h2>
              <button 
                onClick={() => { setIsModalOpen(false); setModalWeight(''); setModalHeight(''); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleStartConsultation}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Patient Autocomplete */}
                  <div className="space-y-1.5 col-span-2 relative">
                    <label className="text-sm font-medium text-slate-700">Patient <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={patientSearch}
                        onChange={(e) => {
                          setPatientSearch(e.target.value);
                          setSelectedPatient(null);
                          setShowPatientDropdown(true);
                        }}
                        onFocus={() => setShowPatientDropdown(true)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] transition-all"
                        placeholder="Tapez un nom ou un matricule..."
                      />
                    </div>
                    {showPatientDropdown && filteredPatients.length > 0 && !selectedPatient && (
                      <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 max-h-[200px] overflow-y-auto">
                        {filteredPatients.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPatient(p)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                {p.firstName[0]}{p.lastName[0]}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-800">{p.firstName} {p.lastName}</div>
                                <div className="text-[11px] text-slate-500">{p.department || p.category}</div>
                              </div>
                            </div>
                            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{p.matricule}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedPatient && (
                      <div className="mt-2 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                          {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-800">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                          <div className="text-xs text-slate-500">Matricule: {selectedPatient.matricule} · {selectedPatient.department}</div>
                          {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                            <div className="text-xs text-rose-500 font-medium mt-0.5">⚠ Allergies: {selectedPatient.allergies.join(', ')}</div>
                          )}
                        </div>
                        <button type="button" onClick={() => { setSelectedPatient(null); setPatientSearch(''); }} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Type de consultation <span className="text-rose-500">*</span></label>
                    <select required name="type" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] transition-all bg-white">
                      <option value="GENERAL">Générale</option>
                      <option value="URGENCE">Urgence</option>
                      <option value="SUIVI">Suivi</option>
                      <option value="VISITE_EMBAUCHE">Visite d'embauche</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Symptômes initiaux / Motif <span className="text-rose-500">*</span></label>
                    <textarea required name="symptoms" rows={2} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] transition-all resize-none text-sm" placeholder="Décrivez brièvement le motif de la visite..."></textarea>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Diagnostic rapide (Optionnel)</label>
                    <textarea name="diagnosis" rows={2} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] transition-all resize-none text-sm" placeholder="Premier avis médical ou constat..."></textarea>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Constantes (Optionnel)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Tension (mmHg)</label>
                      <input name="tension" type="text" className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] text-sm" placeholder="120/80" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Temp. (°C)</label>
                      <input name="temperature" type="number" step="0.1" className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] text-sm" placeholder="37.5" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Taille (cm)</label>
                      <input name="height" value={modalHeight} onChange={e => setModalHeight(e.target.value)} type="number" className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] text-sm" placeholder="175" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Poids (kg)</label>
                      <input name="weight" value={modalWeight} onChange={e => setModalWeight(e.target.value)} type="number" className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] text-sm" placeholder="70" />
                    </div>
                  </div>
                  
                  {/* Dynamic IMC Display */}
                  {(() => {
                    const imc = calculateImc(Number(modalWeight), Number(modalHeight));
                    if (!imc) return null;
                    const status = getImcStatus(imc);
                    return (
                      <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${status.bg}`}>
                        <div className="flex items-center gap-2">
                          <Activity className={`w-4 h-4 ${status.color}`} />
                          <span className={`text-sm font-bold ${status.color}`}>IMC : {imc}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded bg-white/50 ${status.color}`}>{status.label}</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                <button type="button" onClick={() => { setIsModalOpen(false); setModalWeight(''); setModalHeight(''); }} className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#1b3b31] hover:bg-[#142c24] text-white font-medium transition-colors shadow-sm">
                  Démarrer la consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Panel - Full Consultation View */}
      {openConsultation && (() => {
        const patient = getPatientForConsultation(openConsultation);
        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-stretch justify-end">
            <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
              {/* Header */}
              <div className="p-6 bg-[#1b3b31] text-white flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                      {openConsultation.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{openConsultation.patientName}</h2>
                      <p className="text-white/70 text-sm">Matricule: {openConsultation.patientMatricule} · {formatDate(openConsultation.date)}</p>
                    </div>
                  </div>
                  <Badge variant={openConsultation.status === 'TERMINEE' ? 'success' : 'warning'}>{openConsultation.status}</Badge>
                </div>
                <button onClick={() => setOpenConsultation(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 shrink-0">
                {(['dossier', 'consultation', 'ordonnance'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${detailTab === tab ? 'border-[#1b3b31] text-[#1b3b31]' : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {tab === 'dossier' ? 'Dossier Médical' : tab === 'consultation' ? 'Consultation' : 'Ordonnance'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* TAB: Dossier Médical */}
                {detailTab === 'dossier' && patient && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Nom complet</p>
                        <p className="text-sm font-bold text-slate-800">{patient.firstName} {patient.lastName}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Date de naissance</p>
                        <p className="text-sm font-bold text-slate-800">{new Date(patient.birthDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Genre</p>
                        <p className="text-sm font-bold text-slate-800">{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Poste</p>
                        <p className="text-sm font-bold text-slate-800">{patient.department || '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Droplets className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Groupe sanguin</p>
                          <p className="text-lg font-bold text-red-600">{patient.bloodGroup || 'Non renseigné'}</p>
                        </div>
                      </div>
                      {!patient.bloodGroup && (
                        <select
                          value=""
                          onChange={(e) => handleUpdateBloodGroup(e.target.value)}
                          className="bg-white border border-red-200 text-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block px-3 py-1.5 outline-none font-medium cursor-pointer"
                        >
                          <option value="" disabled>Saisir...</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      )}
                    </div>

                    {patient.allergies && patient.allergies.length > 0 && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <p className="text-sm font-bold text-rose-700">Allergies</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.map((a, i) => (
                            <span key={i} className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-amber-500" />
                          <p className="text-sm font-bold text-amber-700">Maladies chroniques</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {patient.chronicConditions.map((c, i) => (
                            <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {detailTab === 'dossier' && !patient && (
                  <p className="text-slate-500 text-center py-8">Dossier patient introuvable dans la base.</p>
                )}

                {/* TAB: Consultation */}
                {detailTab === 'consultation' && (
                  <>
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Motif / Symptômes</p>
                      <p className="text-sm text-slate-700 font-medium">{openConsultation.symptoms}</p>
                    </div>

                    {openConsultation.vitals && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-3">Constantes</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {openConsultation.vitals.tension && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                              <Heart className="w-4 h-4 text-rose-400" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">Tension</p>
                                <p className="text-sm font-bold text-slate-800">{openConsultation.vitals.tension}</p>
                              </div>
                            </div>
                          )}
                          {openConsultation.vitals.temperature && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-amber-400" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">Temp.</p>
                                <p className="text-sm font-bold text-slate-800">{openConsultation.vitals.temperature}°C</p>
                              </div>
                            </div>
                          )}
                          {openConsultation.vitals.height && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-purple-400" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">Taille</p>
                                <p className="text-sm font-bold text-slate-800">{openConsultation.vitals.height} cm</p>
                              </div>
                            </div>
                          )}
                          {openConsultation.vitals.weight && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                              <Weight className="w-4 h-4 text-blue-400" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">Poids</p>
                                <p className="text-sm font-bold text-slate-800">{openConsultation.vitals.weight} kg</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {(() => {
                          const imc = calculateImc(openConsultation.vitals.weight, openConsultation.vitals.height);
                          if (!imc) return null;
                          const status = getImcStatus(imc);
                          return (
                            <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${status.bg}`}>
                              <div className="flex items-center gap-2">
                                <Activity className={`w-4 h-4 ${status.color}`} />
                                <span className={`text-sm font-bold ${status.color}`}>IMC : {imc}</span>
                              </div>
                              <span className={`text-xs font-semibold px-2 py-1 rounded bg-white/50 ${status.color}`}>{status.label}</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-2">Diagnostic</label>
                      <textarea
                        value={editDiagnosis}
                        onChange={e => setEditDiagnosis(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] transition-all resize-none text-sm"
                        placeholder="Saisissez le diagnostic..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-2">Notes complémentaires</label>
                      <textarea
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31] transition-all resize-none text-sm"
                        placeholder="Notes internes..."
                      />
                    </div>

                    <button
                      onClick={handleSaveDiagnosis}
                      className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium rounded-xl text-sm border border-sky-200 transition-colors"
                    >
                      Enregistrer le diagnostic
                    </button>
                  </>
                )}

                {/* TAB: Ordonnance */}
                {detailTab === 'ordonnance' && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800">Prescriptions actuelles</h3>
                      {openConsultation.prescriptions.length > 0 && (
                        <button 
                          onClick={() => window.print()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Imprimer l'ordonnance
                        </button>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 mb-6">
                      {openConsultation.prescriptions.length === 0 ? (
                        <div className="p-8 text-center">
                          <Pill className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-500 text-sm">Aucune prescription pour le moment.</p>
                        </div>
                      ) : (
                        openConsultation.prescriptions.map((p, idx) => (
                          <div key={idx} className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                              <Pill className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800">{p.medicationName}</p>
                              <p className="text-xs text-slate-500">{p.dosage} — {p.duration}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                      <h3 className="text-sm font-bold text-slate-800">Ajouter un médicament</h3>
                      <input
                        value={newMedName}
                        onChange={e => setNewMedName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31]"
                        placeholder="Nom du médicament (ex: Paracétamol 1000mg)"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={newMedDosage}
                          onChange={e => setNewMedDosage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31]"
                          placeholder="Posologie (ex: 2x/jour)"
                        />
                        <input
                          value={newMedDuration}
                          onChange={e => setNewMedDuration(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3b31]/20 focus:border-[#1b3b31]"
                          placeholder="Durée (ex: 5 jours)"
                        />
                      </div>
                      <button
                        onClick={handleAddPrescription}
                        disabled={!newMedName}
                        className="w-full py-2 bg-[#1b3b31] hover:bg-[#142c24] disabled:opacity-40 text-white font-medium rounded-xl text-sm transition-colors"
                      >
                        + Ajouter à l'ordonnance
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Actions */}
              {openConsultation.status !== 'TERMINEE' && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                  <button
                    onClick={() => setOpenConsultation(null)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleTerminerConsultation}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Terminer la consultation
                  </button>
                </div>
              )}
              {openConsultation.status === 'TERMINEE' && (
                <div className="p-4 border-t border-slate-100 bg-emerald-50 flex justify-center shrink-0">
                  <p className="text-emerald-700 font-medium text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Consultation terminée</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
