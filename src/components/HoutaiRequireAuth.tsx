import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/HoutaiAuthContext"

const HoutaiRequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/houtaiLogin" state={{ from: location }} replace />
  }

  return children
}

export default HoutaiRequireAuth
