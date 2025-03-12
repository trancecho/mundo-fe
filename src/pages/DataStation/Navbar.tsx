import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();

    const categories = [
        { path: 'math', label: '高数' },
        { path: 'physics', label: '大物' },
        { path: 'c-language', label: 'C语言' },
        { path: 'others', label: '其他' }
    ];

    return (
        <div className={styles.navbar}>
            {categories.map(({ path, label }) => (
                <div
                    key={path}
                    className={`${styles.navItem} ${currentPath === path ? styles.active : ''}`}
                    onClick={() => navigate(`/datastation/${path}`)}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};


export default Navbar;
