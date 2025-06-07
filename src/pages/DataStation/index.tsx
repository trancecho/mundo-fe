import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Header from '@/components/Header/Header'
import styles from './DataStation.module.css'
import { SearchProvider } from '@/components/Header/SearchContext'

const DataStationContent: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Navbar />
          <div className={styles.mainContent}>
            <div className={styles.outletContainer}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const DataStation = () => {
  return (
    // <SearchProvider>
    <DataStationContent />
    // </SearchProvider>
  )
}

export default DataStation
