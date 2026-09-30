import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const MOCK_USER: User = {
  id: 'USR-BCRG-01',
  name: 'Dr. Ousmane Bangoura',
  email: 'o.bangoura@bcrg-guinee.org',
  role: 'MEDECIN',
  title: 'Médecin Chef d\'Infirmerie',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
};

const MOCK_ADMIN: User = {
  id: 'USR-BCRG-ADMIN',
  name: 'Admin BCRG',
  email: 'admin@bcrg-guinee.org',
  role: 'ADMIN' as any,
  title: 'Administrateur / RH',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
};

const MOCK_PATIENT: User = {
  id: 'USR-BCRG-PATIENT',
  name: 'Employé Patient',
  email: 'patient@bcrg-guinee.org',
  role: 'PATIENT' as any,
  title: 'Employé BCRG',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('bcrg_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('bcrg_auth_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('bcrg_auth_user');
    }
  }, [user]);

  const login = (role = 'MEDECIN') => {
    if (role === 'ADMIN') {
      setUser(MOCK_ADMIN);
    } else if (role === 'PATIENT') {
      setUser(MOCK_PATIENT);
    } else {
      setUser({
        ...MOCK_USER,
        role: role as any,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
