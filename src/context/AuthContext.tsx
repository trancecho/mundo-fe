import React, { createContext, useContext, useState } from 'react'

interface AuthContextType {
  email: string | null
  setEmailFunc: (email: string) => void
  longtoken: string | null
  setTokenFunc: (token: string) => void
  external: string | null
  setExternalFunc: (external: string) => void
  role: string | null
  setRoleFunc: (role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 工具函数：读取本地缓存
const getStoredValue = (key: string): string | null => {
  return localStorage.getItem(key)
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmailState] = useState<string | null>(() => getStoredValue('email'))
  const [longtoken, setTokenState] = useState<string | null>(() =>
    getStoredValue('longtoken')
  )
  const [external, setExternalState] = useState<string | null>(() =>
    getStoredValue('external')
  )
  const [role, setRoleState] = useState<string | null>(() => getStoredValue('role'))

  const setEmailFunc = (email: string) => {
    setEmailState(email)
    localStorage.setItem('email', email)
  }

  const setTokenFunc = (token: string) => {
    setTokenState(token)
    localStorage.setItem('longtoken', token)
  }

  const setExternalFunc = (external: string) => {
    setExternalState(external)
    localStorage.setItem('external', external)
  }

  const setRoleFunc = (role: string) => {
    setRoleState(role)
    localStorage.setItem('role', role)
  }

  const logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('longtoken')
    localStorage.removeItem('external')
    localStorage.removeItem('role')
    localStorage.removeItem('houtaiLogin')
    localStorage.removeItem('stuffid')
  }

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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
