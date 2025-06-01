import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/HoutaiAuthContext'
import { IconLoading } from '@arco-design/web-react/icon'
const HoutaiRequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <IconLoading />
  }
  if (!isLoggedIn) {
    return <Navigate to='/houtaiLogin' state={{ from: location }} replace />
  }

  return children
}

export default HoutaiRequireAuth
