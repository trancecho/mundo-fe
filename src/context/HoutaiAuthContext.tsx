import React, { createContext, useContext, useEffect, useState } from "react"
import { loginManager } from "@/router/api"
import { Message } from "@arco-design/web-react"
interface AuthContextType {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}
const HoutaiAuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => false,
  logout: () => { },
})

export const HoutaiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const login = async (email: string, password: string) => {
    try {
      const data = await loginManager(email, password);
      localStorage.setItem("longtoken", data.data.token);
      setIsLoggedIn(true)
      return true;
    } catch (err) {
      Message.error("登录失败，请稍后重试");
      return false;
    }
  }
  const logout = () => {
    localStorage.removeItem("longtoken");
    setIsLoggedIn(false);
  }

  return (
    <HoutaiAuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </HoutaiAuthContext.Provider>
  )
}

export const useAuth = () => useContext(HoutaiAuthContext)
