import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  email: string | null;
  setEmailFunc: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmailState] = useState<string | null>(
    () => localStorage.getItem('email') // 初始值从 localStorage 中获取
  );

  const setEmailFunc = (email: string) => {
    setEmailState(email);
    localStorage.setItem('email', email); // 保存到 localStorage
  };

  return (
    <AuthContext.Provider value={{ email, setEmailFunc }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
