import React, { useState } from 'react';
import styles from './Houtai.module.css'; // 引入CSS模块
import DashboardNavigation from '@/components/Dashboard/DashboardNavigation';
import DashboardFrontpage from '@/pages/Houtai/DashboardFrontpage';
import {Outlet} from 'react-router-dom';


const Houtai: React.FC = () => {

  return (
    <div className="relative h-screen ">
      <div className={styles.header}>MUNDO后台</div>
      <div className="flex">
        <div className="ml-[10%]">
          <DashboardNavigation />
        </div>

        <div className="ml-[10%] w-[70%]">
          <Outlet />
        </div>        
      </div>

    </div>

  );
};

export default Houtai;
