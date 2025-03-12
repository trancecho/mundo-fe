import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const menuItems = [
    { path: '/qanda', label: '答疑' },
    { path: '/forum', label: '论坛' },
    { path: '/teamup', label: '组队' },
    { path: '/datastation', label: '资料' },
    { path: '/timerme', label: 'timerme' }
];

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activePath, setActivePath] = useState<string | null>(null);

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        const currentPath = new URL(window.location.href).pathname;
        const matchedItem = menuItems.find(item => currentPath.startsWith(item.path));
        if (matchedItem) {
            setActivePath(matchedItem.path);
        } else {
            setActivePath(null);
        }
    }, [location.pathname]);

    return (
        <div className='HeaderMenu'>
            {menuItems.map((item) => (
                <div
                    key={item.path}
                    className={`HeaderMenuButton ${item.path === activePath ? 'clicked' : ''}`}
                    onClick={() => handleMenuClick(item.path)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default Menu;
