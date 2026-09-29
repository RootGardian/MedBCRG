import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import bcrgLogo from '../../assets/bcrg_logo.png';

export const LoginPage: React.FC = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matricule || !password) {
      showToast('Erreur', 'Veuillez renseigner votre matricule et votre mot de passe.', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      setIsLoading(false);
      
      if (matricule === '2000' && password === 'medi1') {
        login('MEDECIN');
        navigate('/');
        showToast('Bienvenue', 'Connexion réussie au portail Médecin', 'success');
      } else if (matricule === '2001' && password === 'medi1') {
        login('ADMIN');
        navigate('/admin');
        showToast('Bienvenue', 'Connexion réussie au portail Administration & RH', 'success');
      } else {
        showToast('Échec', 'Matricule ou mot de passe incorrect.', 'error');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1b3b31] relative overflow-hidden flex-col items-center justify-center text-white">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] bg-black/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Dots pattern bottom left */}
        <div className="absolute bottom-12 left-12 grid grid-cols-6 gap-2 opacity-20">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>

        <div className="z-10 flex flex-col items-center">
          <img src={bcrgLogo} alt="BCRG Logo" className="w-80 mb-10 drop-shadow-lg" />
          <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">MedBCRG</h1>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center relative px-8 sm:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="p-4 bg-[#1b3b31] rounded-2xl mb-4">
              <img src={bcrgLogo} alt="BCRG Logo" className="w-32" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#1b3b31] tracking-tight">MedBCRG</h1>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Connexion</h2>
            <p className="text-slate-500 text-xs">Veuillez renseigner vos identifiants pour accéder à l'application.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Matricule Input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                Matricule
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="ex: 1234"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded outline-none focus:border-[#1b3b31] focus:ring-1 focus:ring-[#1b3b31] transition-all text-sm text-slate-700 bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-2.5 border border-slate-200 rounded outline-none focus:border-[#1b3b31] focus:ring-1 focus:ring-[#1b3b31] transition-all text-sm text-slate-700 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1b3b31] hover:bg-[#122821] text-white font-medium py-3 rounded mt-4 flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-[#1b3b31]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Se Connecter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 text-xs text-slate-400 text-center w-full px-8">
          © {new Date().getFullYear()} Banque Centrale de la République de Guinée. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};
