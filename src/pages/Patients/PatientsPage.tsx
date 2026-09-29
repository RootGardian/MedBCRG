import React, { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, FileText, Users, MoreHorizontal, X, Eye, Download } from 'lucide-react';
import { Patient } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { PATIENT_CATEGORIES_LABEL } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Side panel state
  const [openPatient, setOpenPatient] = useState<Patient | null>(null);
  const [detailTab, setDetailTab] = useState<'infos' | 'historique' | 'documents'>('infos');

  useEffect(() => {
    setPatients(apiService.getPatients());
  }, []);

  const patientConsultations = openPatient 
    ? apiService.getConsultations().filter(c => c.patientId === openPatient.id)
    : [];

  const filteredPatients = patients.filter(p =>
    p.firstName.toLowerCase().includes(search.toLowerCase()) ||
    p.lastName.toLowerCase().includes(search.toLowerCase()) ||
    p.matricule.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-[#0f172a]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Dossiers Médicaux</h1>
            <p className="text-slate-500 mt-1 text-sm">Gérez les dossiers médicaux du personnel BCRG et ayants-droit.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 rounded-t-2xl bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, matricule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-lg outline-none text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">Matricule</th>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">Poste</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{patient.matricule}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{patient.firstName} {patient.lastName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{patient.department || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === patient.id ? null : patient.id)}
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {activeMenu === patient.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                            <button 
                              onClick={() => { setOpenPatient(patient); setActiveMenu(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 transition-colors"
                            >
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
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Aucun patient trouvé correspondant à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Panel */}
      {openPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-stretch justify-end">
          <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
            {/* Header */}
            <div className="p-6 bg-[#1b3b31] text-white flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                    {openPatient.firstName[0]}{openPatient.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{openPatient.firstName} {openPatient.lastName}</h2>
                    <p className="text-white/70 text-sm">Matricule: {openPatient.matricule}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpenPatient(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 shrink-0">
              {(['infos', 'historique', 'documents'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    detailTab === tab ? 'border-[#1b3b31] text-[#1b3b31]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'infos' ? 'Informations' : tab === 'historique' ? 'Historique Médical' : 'Documents'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB: Informations */}
              {detailTab === 'infos' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Date de naissance</p>
                      <p className="text-sm font-bold text-slate-800">{new Date(openPatient.birthDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Sexe</p>
                      <p className="text-sm font-bold text-slate-800">{openPatient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 col-span-2">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Poste</p>
                      <p className="text-sm font-bold text-slate-800">{openPatient.department || '-'}</p>
                    </div>
                  </div>

                  {openPatient.bloodGroup && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold">
                        O+
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Groupe sanguin</p>
                        <p className="text-sm font-bold text-red-600">{openPatient.bloodGroup}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB: Historique */}
              {detailTab === 'historique' && (
                <div className="space-y-4">
                  {patientConsultations.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">Aucune consultation pour ce patient.</p>
                  ) : (
                    patientConsultations.map(consult => (
                      <div key={consult.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800">{formatDate(consult.date)}</h4>
                          <Badge variant={consult.status === 'TERMINEE' ? 'success' : 'warning'}>{consult.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mb-1">{consult.symptoms}</p>
                        {consult.diagnosis && (
                          <div className="bg-sky-50 rounded p-2 mt-2">
                            <span className="text-xs font-bold text-sky-700 block">Diagnostic:</span>
                            <span className="text-sm text-sky-800">{consult.diagnosis}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB: Documents */}
              {detailTab === 'documents' && (
                <div className="space-y-4">
                  {patientConsultations.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                      <p>Aucun document généré pour ce patient.</p>
                      <p className="text-xs mt-1">La gestion documentaire PDF sera rattachée au backend.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                      {patientConsultations.map(consult => (
                        <div key={consult.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">Ordonnance - {formatDate(consult.date)}</p>
                              <p className="text-xs text-slate-500">Document PDF • Généré automatiquement</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => alert('Aperçu du document PDF en cours de construction (Backend)')}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Prévisualiser"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => alert('Téléchargement du document PDF en cours de construction (Backend)')}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
