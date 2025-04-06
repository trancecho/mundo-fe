import React from "react";
import styles from "./Houtai.module.css"; // 引入CSS模块
import DashboardNavigation from "@/components/Dashboard/DashboardNavigation";
import { Outlet } from "react-router-dom";

const Houtai: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="py-4 mb-8 text-center text-white shadow-md bg-slate-800">
        <h1 className="text-2xl font-bold tracking-wider">MUNDO后台管理系统</h1>
      </div>

      <div className="flex flex-col px-4 py-6 mx-auto md:flex-row">
        <div className="w-full mb-6 md:w-1/5 md:mb-0">
          <DashboardNavigation />
        </div>

        <div className="w-full p-6 rounded-lg shadow-md bg-[#1e293b] md:w-4/5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Houtai;
