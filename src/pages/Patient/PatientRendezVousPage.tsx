import React, { useState } from 'react';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight, Check, X, CalendarIcon, ArrowLeft, Info, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

export const PatientRendezVousPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDatePivot, setCurrentDatePivot] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [selectedType, setSelectedType] = useState('Consultation Générale');
  const [reason, setReason] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDatePivot);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDatePivot(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDatePivot);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDatePivot(newDate);
  };

  const renderCalendar = () => {
    const year = currentDatePivot.getFullYear();
    const month = currentDatePivot.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // 1 = Monday

    const days = [];
    const today = new Date();

    for (let i = 1; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border-r border-b border-slate-100 bg-slate-50/30"></div>);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      const isSelectable = !isPast && !isWeekend;

      days.push(
        <div
          key={i}
          onClick={() => isSelectable && setSelectedDate(date)}
          className={`min-h-[80px] p-2 border-r border-b border-slate-100 relative flex flex-col items-center justify-center
            ${!isSelectable ? 'bg-slate-50 opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-sky-50 transition-colors'}
            ${isSelected ? 'bg-sky-100 border-sky-300' : ''}
          `}
        >
          <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full 
            ${isToday ? 'bg-sky-600 text-white' : 'text-slate-700'}
            ${isSelected && !isToday ? 'bg-[#1b3b31] text-white' : ''}
          `}>
            {i}
          </span>
          {isSelectable && (
            <span className="text-[10px] text-emerald-600 font-medium mt-1">Dispos</span>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="font-bold text-slate-800 capitalize">
            {currentDatePivot.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 shrink-0">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
            <div key={d} className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200 last:border-r-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Banner */}
      <div className="bg-[#1b3b31] rounded-2xl p-8 relative overflow-hidden text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">Prendre un Rendez-vous</h1>
            <p className="text-white/80">
              Sélectionnez une date et une heure pour votre consultation au sein du centre médical de la BCRG.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Colonne Gauche : Calendrier */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 bg-sky-100 rounded-lg text-sky-600 shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Comment ça marche ?</h3>
              <p className="text-slate-600 text-sm mt-1">
                Choisissez d'abord une date dans le calendrier ci-dessous. Les jours grisés correspondent aux weekends ou aux jours fériés. Une fois la date sélectionnée, les créneaux disponibles s'afficheront sur la droite.
              </p>
            </div>
          </div>

          {renderCalendar()}
        </div>

        {/* Colonne Droite : Créneaux et Formulaire */}
        <div className="space-y-6">
          {!selectedDate ? (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[400px]">
              <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="font-semibold text-slate-700 mb-1">Aucune date sélectionnée</h3>
              <p className="text-sm text-slate-500">Veuillez choisir une date sur le calendrier pour voir les horaires disponibles.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-right-8">
              <div className="p-6 bg-[#1b3b31] text-white">
                <h3 className="font-bold text-lg capitalize">
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-white/80 text-sm">Sélectionnez l'heure de votre consultation</p>
              </div>

              <div className="p-6 border-b border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Choisissez l'heure du rendez-vous</label>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-[#1b3b31] bg-slate-50 text-lg font-medium"
                  />
                </div>
              </div>
              <form
                className="p-6 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedDate) return;

                  const dateTimeString = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    parseInt(selectedTime.split(':')[0]),
                    parseInt(selectedTime.split(':')[1])
                  ).toISOString();

                  apiService.addAppointment({
                    patientId: 'PAT-002',
                    patientName: 'Employé Patient',
                    patientMatricule: '1002',
                    doctorName: 'Dr. Ousmane Bangoura',
                    dateTime: dateTimeString,
                    reason: `${selectedType} - ${reason}`,
                    status: 'PROGRAMME'
                  });

                  setIsConfirmModalOpen(true);
                }}
              >


                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type de consultation</label>
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#1b3b31] bg-slate-50 text-sm"
                  >
                    <option>Consultation Générale</option>
                    <option>Visite d'embauche</option>
                    <option>Visite Annuelle</option>
                    <option>Consultation Spécialisée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Motif / Symptômes</label>
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#1b3b31] bg-slate-50 text-sm"
                    placeholder="Décrivez brièvement la raison de votre visite..."
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full py-3 text-sm font-bold text-white bg-[#1b3b31] hover:bg-[#122821] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Confirmer le rendez-vous
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Rendez-vous Confirmé !</h2>
              <p className="text-slate-600 text-sm">
                Votre demande de rendez-vous pour le <span className="font-semibold">{selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}</span> a bien été enregistrée.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
