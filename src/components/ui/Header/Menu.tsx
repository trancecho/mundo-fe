import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // 假设有对应的CSS文件来管理样式

const Menu: React.FC = () => {
    const [activateMenu, setActivateMenu] = useState<string>('答疑');
    const navigate = useNavigate();

    const handleMenuClick = (menu: string, path: string) => {
        setActivateMenu(menu); // 更新当前激活菜单
        navigate(path); // 跳转到指定路径
    };

    return (
        <div className='HeaderMenu'>
            <div
                className={`HeaderMenuButton ${activateMenu === "答疑" ? 'clicked' : ''}`}
                onClick={() => handleMenuClick('答疑', '/qanda')}
            >
                答疑
            </div>
            <div
                className={`HeaderMenuButton ${activateMenu === "论坛" ? 'clicked' : ''}`}
                onClick={() => handleMenuClick('论坛', '/forum')}
            >
                论坛
            </div>
            <div
                className={`HeaderMenuButton ${activateMenu === "组队" ? 'clicked' : ''}`}
                onClick={() => handleMenuClick('组队', '/teamup')}
            >
                组队
            </div>
            <div
                className={`HeaderMenuButton ${activateMenu === "资料" ? 'clicked' : ''}`}
                onClick={() => handleMenuClick('资料', '/datastation')}
            >
                资料
            </div>
            <div
                className={`HeaderMenuButton ${activateMenu === "timerme" ? 'clicked' : ''}`}
                onClick={() => handleMenuClick('timerme', '/timerme')}
            >
                timerme
            </div>
        </div>
    );
}

export default Menu;
