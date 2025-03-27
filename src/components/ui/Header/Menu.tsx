import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Menu.module.css';
import { useAuth } from '../../../context/AuthContext';

const baseMenuItems = [
    { path: '/qanda', label: '答疑', icon: '💡' },
    { path: '/article', label: '时文', icon: '📝' },
    { path: '/teamup', label: '组队', icon: '👥' },
    { path: '/datastation', label: '资料', icon: '📚' },
    { path: '/center', label:'创作者中心', icon: '➕'}
];

const adminMenuItems = [
    { path: '/timerme', label: 'TimerMe', icon: '⏱️' }
];

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activePath, setActivePath] = useState<string | null>(null);
    const { role } = useAuth();

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        const currentPath = new URL(window.location.href).pathname;
        const allMenuItems = [...baseMenuItems, ...(role === 'admin' ? adminMenuItems : [])];
        const matchedItem = allMenuItems.find(item => currentPath.startsWith(item.path));
        if (matchedItem) {
            setActivePath(matchedItem.path);
        } else {
            setActivePath(null);
        }
    }, [location.pathname, role]);

    return (
        <nav className={styles.menu}>
            {[...baseMenuItems, ...(role === 'admin' ? adminMenuItems : [])].map((item) => (
                <button
                    key={item.path}
                    className={`${styles.menuItem} ${item.path === activePath ? styles.active : ''}`}
                    onClick={() => handleMenuClick(item.path)}
                >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default Menu;
