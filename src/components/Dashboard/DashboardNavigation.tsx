import React, { useState, useEffect } from "react";
import styles from "@/pages/Houtai/Houtai.module.css"; // 引入CSS模块
import dashboardStyles from "./Dashboardpage.module.css"; // 引入仪表盘样式
import { useLocation } from "react-router-dom";
import { useNavigation } from "./utils/useNavigation.ts";

const menuItems = [
  { key: "dashboardfrontpage", label: "管理首页", icon: "📊" },
  { key: "multiPersonChat", label: "客服窗口", icon: "💬" },
  { key: "faq", label: "FAQ设置", icon: "❓" },
  { key: "check", label: "内容审核", icon: "✅" },
  { key: "feedback", label: "用户反馈", icon: "❓" }
];

export default function DashboardNavigation() {
  const location = useLocation();
  const [activeView, setActiveView] = useState(""); // 默认激活视图
  const handleNavigationToAbout = useNavigation();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path) {
      setActiveView(path);
    } else {
      setActiveView("dashboardfrontpage");
    }
  }, [location.pathname]);

  const handleClick = (text: string) => {
    setActiveView(text); // 更新激活视图
    handleNavigationToAbout(text); // 使用导航函数
  };

  return (
    <nav className="p-4 rounded-lg shadow-lg ">
      <div className={dashboardStyles.sidebar}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`${dashboardStyles.menuItem} ${activeView === item.key ? dashboardStyles.active : ""
              } flex items-center gap-3 px-4 py-3`}
            onClick={() => handleClick(item.key)}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
