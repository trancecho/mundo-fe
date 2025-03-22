import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  email: string | null;
  setEmailFunc: (email: string) => void;
  longtoken: string | null;
  setTokenFunc: (longtoken: string) => void;
  external: string | null;
  setExternalFunc: (external: string) => void;
  role: string | null;
  setRoleFunc: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<string | null>(
    () => localStorage.getItem("role") // 初始值从 localStorage 中获取
  );

  const setRoleFunc = (role: string) => {
    setRoleState(role);
    localStorage.setItem("role", role); // 保存到 localStorage
  };

  const [email, setEmailState] = useState<string | null>(
    () => localStorage.getItem("email") // 初始值从 localStorage 中获取
  );

  const setEmailFunc = (email: string) => {
    setEmailState(email);
    localStorage.setItem("email", email); // 保存到 localStorage
  };

  const [longtoken, setTokenState] = useState<string | null>(
    () => localStorage.getItem("longtoken") // 初始值从 localStorage 中获取
  );

  const setTokenFunc = (longtoken: string) => {
    setTokenState(longtoken);
    localStorage.setItem("longtoken", longtoken); // 保存到 localStorage
  };

  const [external, setExternalState] = useState<string | null>(
    () => localStorage.getItem("external") // 初始值从 localStorage 中获取
  );

  const setExternalFunc = (external: string) => {
    setExternalState(external);
    localStorage.setItem("external", external); // 保存到 localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmailFunc,
        longtoken,
        setTokenFunc,
        external,
        setExternalFunc,
        role,
        setRoleFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
