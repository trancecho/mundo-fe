import React, { useState,useEffect } from 'react'
import styles from '@/pages/Houtai/Houtai.module.css'; // 引入CSS模块
import { useLocation } from 'react-router-dom';
import { useNavigation } from './utils/useNavigation.ts';
const menuItems = [
    { key: 'dashboardfrontpage', label: '首页' },
    { key: 'multiPersonChat', label: '客服窗口' },
    { key: 'faq', label: 'FAQ设置' },
    { key: 'check', label: '审核' }
];

export default function DashboardNavigation() {
    const location = useLocation();
    const [activeView, setActiveView] = useState(''); // 默认激活视图
    const handleNavigationToAbout = useNavigation();
    useEffect(() => {
        switch (location.pathname) {
            case '/multiPersonChat':
                setActiveView('multiPersonChat');
                break;
            case '/faq':
                setActiveView('faq');
                break;
            case '/check':
                setActiveView('check');
                break;
            case '/dashboardfrontpage':
                setActiveView('dashboardfrontpage');
                break;
            default:
                break;
        }
      }, [location.pathname]);
        
    const handleClick = (text:string) => {
        setActiveView(text); // 更新激活视图
        handleNavigationToAbout(text); // 使用导航函数

    };
    return (
        <div>
            <div className={styles.sidebar}>
            {menuItems.map((item) => (
            <div
                key={item.key}
                className={`${styles.menuItem} ${
                    activeView === item.key ? styles.active : ''
                }`}
                onClick={() => handleClick(item.key)}
            >
                {item.label}
            </div>
            ))}
        </div>
        </div>
    )
}
