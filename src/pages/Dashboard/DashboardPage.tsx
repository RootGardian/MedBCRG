import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, CalendarDays, ActivitySquare, ArrowRight, Pill, ShieldCheck } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { apiService } from '../../services/api';
import { DashboardStats, Consultation } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    setStats(apiService.getDashboardStats());
    setRecentConsultations(apiService.getConsultations().slice(0, 5));
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner Admin */}
      <div className="bg-[#1b3b31] rounded-2xl p-8 relative overflow-hidden text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 bg-white/10 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>{user?.role || 'Administration'}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Tableau de bord {user?.role?.toLowerCase() || 'admin'}</h1>
            <p className="text-white/80">
              Vue globale des ressources, des consultations et des tendances pour piloter les opérations de l'infirmerie.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-sm font-medium">
              <CalendarDays className="w-4 h-4" />
              <span>{formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Cards - 5 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Consultations aujourd'hui</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ActivitySquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">{stats.consultationsToday}</div>
          <div className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md self-start">
            Aujourd'hui
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Consultations actives</span>
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <ActivitySquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">{recentConsultations.filter(c => c.status === 'EN_COURS').length || 2}</div>
          <div className="inline-block px-2 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-md self-start">
            En cours
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Départements</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">12</div>
          <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-md self-start">
            Ressource
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Personnel examiné</span>
            <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">{stats.activePatients}</div>
          <div className="inline-block px-2 py-1 bg-cyan-50 text-cyan-600 text-xs font-semibold rounded-md self-start">
            Ressource
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-500 font-medium">Utilisateurs</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-4">4</div>
          <div className="inline-block px-2 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-md self-start">
            Interne + Externe
          </div>
        </div>
      </div>

      {/* Nouveaux Blocs pour étoffer le contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Évolution de l'activité (Faux graphique en barres avec Tailwind) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Évolution de l'activité</h2>
              <p className="text-xs text-slate-500 mt-1">Nombre de consultations sur les 7 derniers jours</p>
            </div>
            <div className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">
              Cette semaine
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto">
            {[45, 60, 30, 80, 50, 90, 75].map((height, idx) => (
              <div key={idx} className="w-full h-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-50 rounded-t-md flex items-end justify-center relative flex-1">
                  <div 
                    className="w-full bg-[#1b3b31] rounded-t-md transition-all duration-500 group-hover:bg-emerald-600 relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded transition-opacity z-10">
                      {height}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium uppercase">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tâches et Alertes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Alertes & Tâches</h2>
            <Badge variant="warning">{stats.lowStockAlerts} en attente</Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-rose-100 bg-rose-50/50">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">Rupture de stock : Paracétamol</h3>
                <p className="text-xs text-slate-500 mt-0.5">Le stock est en dessous du seuil critique (5 boîtes restantes).</p>
              </div>
              <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-lg border border-rose-200">
                Commander
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">Visites médicales obligatoires</h3>
                <p className="text-xs text-slate-500 mt-0.5">3 agents doivent passer leur visite d'aptitude cette semaine.</p>
              </div>
              <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-amber-200">
                Planifier
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">Approbation de dossiers</h3>
                <p className="text-xs text-slate-500 mt-0.5">2 nouveaux dossiers patients attendent votre validation finale.</p>
              </div>
              <button className="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                Vérifier
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-10">
        {/* Left Column: Consultations Récentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Consultations Récentes</h2>
            <Link to="/consultations" className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentConsultations.map((consultation) => (
                  <tr key={consultation.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-slate-800">{consultation.patientName}</div>
                      <div className="text-slate-500 text-xs">{consultation.patientMatricule}</div>
                    </td>
                    <td className="py-4 text-slate-600">{formatDate(consultation.date)}</td>
                    <td className="py-4">
                      <Badge variant={consultation.type === 'URGENCE' ? 'danger' : 'info'}>
                        {consultation.type}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={consultation.status === 'TERMINEE' ? 'success' : 'warning'}>
                        {consultation.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {recentConsultations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Aucune consultation récente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Accès Rapides */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Accès Rapides</h2>
          
          <div className="space-y-4">
            <Link to="/patients" className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-sky-100 hover:bg-sky-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Nouveau Patient</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ajouter un dossier médical</p>
              </div>
            </Link>

            <Link to="/consultations" className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ActivitySquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Nouvelle Consultation</h3>
                <p className="text-xs text-slate-500 mt-0.5">Démarrer un examen</p>
              </div>
            </Link>

            <Link to="/pharmacie" className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Délivrer Médicament</h3>
                <p className="text-xs text-slate-500 mt-0.5">Gestion de la pharmacie</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
