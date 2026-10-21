import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users, Shield, CalendarClock, Bell, Activity,
  Settings2, Calendar, Building, CheckCircle, Clock, ChevronDown,
  FileText, ListPlus, Download, Droplet
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { apiService } from '../../services/api';
import { HrDashboardData, HrStatisticsData, HrDiabetesStatisticsData } from '../../types';

export const AdminPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { showToast } = useNotifications();

  let activeTab = 'stats';
  if (path.includes('/admin/users')) activeTab = 'users';
  if (path.includes('/admin/settings')) activeTab = 'settings';
  if (path.includes('/admin/campaigns')) activeTab = 'campaigns';
  if (path.includes('/admin/logs')) activeTab = 'logs';

  const tabInfo: Record<string, { title: string, desc: string }> = {
    stats: { title: 'Tableau de bord admin & RH', desc: 'Vue globale de la médecine du travail, pilotage des indicateurs RH et suivi de la santé au travail.' },
    users: { title: 'Gestion des comptes', desc: 'Gérez les accès, rôles et permissions des utilisateurs de l\'application.' },
    settings: { title: 'Périodicité des Visites', desc: 'Gérez la fréquence des visites médicales obligatoires selon le profil des employés.' },
    logs: { title: 'Historique & Logs', desc: 'Trace d\'audit et journal d\'activité du système.' },
  };

  const currentTabInfo = tabInfo[activeTab] || tabInfo.stats;

  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Aujourd\'hui');
  const [isExporting, setIsExporting] = useState(false);
  const [hrData, setHrData] = useState<HrDashboardData | null>(null);
  const [hrStats, setHrStats] = useState<HrStatisticsData | null>(null);
  const [hrDiabetes, setHrDiabetes] = useState<HrDiabetesStatisticsData | null>(null);
  const timeOptions = ['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Cette année', 'Toutes les dates'];

  // Date du jour formatée
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    apiService.getHrDashboard().then(res => {
      if (res) setHrData(res);
    });
    apiService.getHrStatistics().then(res => {
      if (res) setHrStats(res);
    });
    apiService.getHrDiabetesStatistics().then(res => {
      if (res) setHrDiabetes(res);
    });
  }, []);

  const handleExportPdf = async () => {
    setIsExporting(true);
    showToast('Exportation en cours', 'Génération du rapport officiel RH en cours...', 'info');
    try {
      await apiService.exportHrReportPdf();
      showToast('Export réussi', 'Le rapport officiel RH a été téléchargé avec succès.', 'success');
    } catch (e: any) {
      showToast('Erreur', e.message || 'Impossible de télécharger le rapport.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const totalEmp = hrData?.totalEmployees || 0;
  const activeEmp = hrData?.activeEmployees || 0;
  const coverageRate = totalEmp > 0 ? `${Math.round((activeEmp / totalEmp) * 100)}%` : '100%';

  const stats = {
    couv: coverageRate,
    ech: 0,
    sui: totalEmp,
    arr: hrData?.employeesOnSickLeaveCurrent || 0,
    urg: 0,
    cons: hrData?.totalConsultationsThisMonth || 0,
    obl: totalEmp,
    inc: 0
  };

  const MOCK_LOGS: any[] = [];

  const filteredLogs = MOCK_LOGS.filter(log => {
    if (timeFilter === "Aujourd'hui") return log.date.includes('23 Sept');
    if (timeFilter === "Cette semaine") return log.date.includes('23 Sept') || log.date.includes('22 Sept');
    if (timeFilter === "Ce mois") return log.date.includes('Sept');
    return true;
  });

  return (
    <div className="w-full h-full space-y-4 animate-in fade-in duration-300 pb-8 font-sans">

      {/* Banner */}
      <div className="bg-[#1b3b31] rounded-2xl p-6 text-white relative shadow-sm w-full">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 text-[10px] font-bold uppercase tracking-wider mb-3 bg-white/10 text-white">
              <Shield className="w-3.5 h-3.5" />
              ADMINISTRATION
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 leading-tight">{currentTabInfo.title}</h1>
            <p className="text-white/80 text-sm">{currentTabInfo.desc}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Génération...' : 'Exporter le rapport (PDF)'}
            </button>
            {activeTab === 'logs' && (
              <button
                onClick={() => showToast('Export en cours', "Le téléchargement du journal d'audit au format PDF va démarrer.", 'info')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Exporter le journal
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowTimeMenu(!showTimeMenu)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {timeFilter === 'Aujourd\'hui' ? today : timeFilter}
                <ChevronDown className={`w-4 h-4 transition-transform ${showTimeMenu ? 'rotate-180' : ''}`} />
              </button>

              {showTimeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTimeMenu(false)} />
                  <div className="absolute right-0 top-12 z-20 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-48 animate-in fade-in slide-in-from-top-2">
                    {timeOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setTimeFilter(opt); setShowTimeMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${timeFilter === opt ? 'font-bold text-[#1b3b31] bg-emerald-50/50' : 'text-slate-600'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* TAB: STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-4 mt-4">

            {/* KPI Row (5 Cards) - Proportion du portail médecin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-500 font-medium">Taux de couverture</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-4">{stats.couv}</div>
                <div className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md self-start">
                  Visites à jour
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-500 font-medium">Visites échues</span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-4">{stats.ech}</div>
                <div className="inline-block px-2 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-md self-start">
                  Relance prioritaire
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-500 font-medium">Employés suivis</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-4">{stats.sui}</div>
                <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-md self-start">
                  Dossiers actifs
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-500 font-medium">Arrêts de travail</span>
                  <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-4">{stats.arr}</div>
                <div className="inline-block px-2 py-1 bg-cyan-50 text-cyan-600 text-xs font-semibold rounded-md self-start">
                  En cours (30 j)
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-500 font-medium">Urgences gérées</span>
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-4">{stats.urg}</div>
                <div className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md self-start">
                  Depuis janvier
                </div>
              </div>
            </div>

            {/* Layout synthétique - Espace réduit */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

              {/* Left Column */}
              <div className="xl:col-span-2 space-y-4">

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">SYNTHÈSE MÉDECINE DU TRAVAIL</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-center border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">CONSULTATIONS</span>
                      <span className="text-2xl font-bold text-slate-800">{stats.cons}</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-center border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">VISITES OBLIGATOIRES</span>
                      <span className="text-2xl font-bold text-slate-800">{stats.obl}</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-center border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">DOSSIERS INCOMPLETS</span>
                      <span className="text-2xl font-bold text-slate-800">{stats.inc}</span>
                    </div>
                  </div>
                </div>

                {/* VISITES PAR JOUR */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">ÉVOLUTION DES VISITES</h3>
                  <div className="space-y-4">
                    <div className="text-center text-slate-500 text-sm py-4">Aucune donnée disponible.</div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">PAR MOTIF DE VISITE</h3>
                  <div className="space-y-4">
                    <div className="text-center text-slate-500 text-sm py-4">Aucune donnée disponible.</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">PAR DIRECTION (BCRG)</h3>
                  <div className="space-y-3">
                    {hrStats && hrStats.byDepartment && hrStats.byDepartment.length > 0 ? (
                      hrStats.byDepartment.map((dept) => (
                        <div key={dept.department} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div>
                            <div className="font-semibold text-xs text-slate-800">{dept.department}</div>
                            <div className="text-[10px] text-slate-400">{dept.employeeCount} collaborateur{dept.employeeCount > 1 ? 's' : ''}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#1b3b31]">{dept.consultationCount} consult.</span>
                            {dept.sickLeaveDays > 0 && (
                              <div className="text-[10px] text-amber-600 font-medium">{dept.sickLeaveDays} j arrêt</div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 text-sm py-4">Aucune donnée disponible.</div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-4">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Gestion des Comptes</h3>
                <p className="text-sm text-slate-500">Ajouter, modifier ou révoquer les accès à l'application.</p>
              </div>
              <button className="bg-[#1b3b31] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#142c24] transition-colors">
                + Nouvel Utilisateur
              </button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-slate-100">Utilisateur</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Rôle (RBAC)</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Statut</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Dernière Connexion</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">Aucun compte pour le moment.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="w-full space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="mb-8 pl-2 border-l-4 border-[#1b3b31]">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Périodicité des Visites</h2>
              <p className="text-slate-500 max-w-2xl">Gérez la fréquence des visites médicales obligatoires selon le profil des employés et configurez les relances automatiques pour maintenir le taux de couverture.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 space-y-8">

                {/* Setting 1: Standard */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                  <div className="flex gap-4 max-w-md">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <CalendarClock className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">Visites Périodiques Standards</h4>
                      <p className="text-sm text-slate-500 mt-1">Fréquence applicable à la majorité du personnel ne présentant pas de risques particuliers (VIP).</p>
                    </div>
                  </div>
                  <div className="w-full md:w-64 shrink-0">
                    <div className="relative">
                      <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b3b31] focus:bg-white transition-all cursor-pointer hover:border-slate-300">
                        <option>Tous les 12 mois</option>
                        <option>Tous les 24 mois</option>
                        <option>Tous les 6 mois</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Setting 2: SMR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                  <div className="flex gap-4 max-w-md">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">Suivi Médical Renforcé (SMR)</h4>
                      <p className="text-sm text-slate-500 mt-1">Postes à risques particuliers : chauffeurs, agents de sécurité, manipulateurs de fonds.</p>
                    </div>
                  </div>
                  <div className="w-full md:w-64 shrink-0">
                    <div className="relative">
                      <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b3b31] focus:bg-white transition-all cursor-pointer hover:border-slate-300" defaultValue="6 mois">
                        <option>Tous les 3 mois</option>
                        <option value="6 mois">Tous les 6 mois</option>
                        <option>Tous les 12 mois</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Setting 3: Relances */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-4 max-w-md">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">Délai de Relance RH</h4>
                      <p className="text-sm text-slate-500 mt-1">Combien de jours avant l'échéance le système doit-il alerter les RH et l'employé concerné.</p>
                    </div>
                  </div>
                  <div className="w-full md:w-64 shrink-0">
                    <div className="relative">
                      <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b3b31] focus:bg-white transition-all cursor-pointer hover:border-slate-300" defaultValue="30 jours">
                        <option value="15 jours">15 jours avant</option>
                        <option value="30 jours">30 jours avant</option>
                        <option value="60 jours">60 jours avant</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer / Save Action */}
              <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-3">
                <button className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors">
                  Annuler
                </button>
                <button
                  onClick={() => showToast('Mise à jour réussie', 'Les règles de périodicité ont été appliquées à tous les dossiers actifs.', 'success')}
                  className="px-8 py-2.5 bg-[#1b3b31] text-white rounded-xl font-bold hover:bg-[#142c24] hover:shadow-lg hover:shadow-[#1b3b31]/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-4 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Journal d'Activité</h3>
                <p className="text-sm text-slate-500">Traçabilité des actions réalisées sur la plateforme.</p>
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-slate-100">Date & Heure</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Utilisateur</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Action</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Détails</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4 text-slate-500 whitespace-nowrap">{log.date}</td>
                      <td className="p-4 font-medium text-slate-800">{log.user}</td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-md font-medium text-xs ${log.colorClass}`}>{log.action}</span></td>
                      <td className="p-4 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">Aucun historique pour cette période.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
