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
  email: 'o.bangoura@bcrg.gov.gn',
  role: 'MEDECIN',
  title: 'Médecin Chef d\'Infirmerie',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bcrg_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bcrg_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bcrg_auth_user');
    }
  }, [user]);

  const login = (role = 'MEDECIN') => {
    setUser({
      ...MOCK_USER,
      role: role as any,
    });
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
