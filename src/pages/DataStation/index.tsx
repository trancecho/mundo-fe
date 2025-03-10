import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from '@/components/ui/Header/Header.tsx'
import styles from './DataStation.module.css';

const DataStation: React.FC = () => {
    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.content}>
                <Navbar />

                    <div className={styles.outletContainer}>
                        <Outlet />
                    </div>

            </div>    
        </div>
        
    );
};

export default DataStation;
