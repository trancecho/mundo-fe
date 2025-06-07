import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Header from '@/components/Header/Header'
import styles from './DataStation.module.css'
import { SearchProvider } from '@/components/Header/SearchContext'

const DataStationContent: React.FC = () => {
  return (
    // <SearchProvider>
    <>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.outletContainer}>
          <Outlet />
        </div>
      </div>
    </>
    // </SearchProvider>
  )
}

export default DataStationContent
