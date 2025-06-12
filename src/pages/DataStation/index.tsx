import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Header from '@/components/Header/Header'
import styles from './DataStation.module.css'
import React, { useEffect, useState } from 'react'
import MobileNavbar from './mobile/MobileNavbar'
const DataStationContent: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <>
      {isMobile ? (
        <div className={styles.mobileContainer}>
          <MobileNavbar />
          <div className={styles.mobileOutletContainer}>
            <Outlet />
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <Navbar />
          <div className={styles.outletContainer}>
            <Outlet />
          </div>
        </div>
      )}
    </>
    // </SearchProvider>
  )
}

export default DataStationContent
