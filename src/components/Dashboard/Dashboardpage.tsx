import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboardpage.module.css';

// 定义样式对象类型
// type DashboardStyles = {
//     dashboardContainer: string;
//     dashboardHeader: string;
//     dashboardWelcome: string;
//     dashboardNav: string;
//     // 根据你在CSS模块中实际定义的类名，依次添加对应的属性声明
// };

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = () => {
    return (
        <div className={styles.body}>
            <h2 className={styles.dashboardHeader}>后台管理界面</h2>
            <p className={styles.dashboardWelcome}>欢迎进入后台管理系统！</p>
            <nav className={styles.dashboardNav}>
                <ul>
                    <li><Link to="/login">去登录</Link></li>
                    <li><Link to="/register">去注册</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default DashboardPage;