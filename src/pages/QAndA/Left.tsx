import React, { useState } from 'react';
import './QAndA.css';

// 定义菜单按钮数据
const menuItems = [
    { id: '首页', label: '首页' },
    { id: '高数', label: '高数' },
    { id: '大物', label: '大物' },
    { id: 'C语言', label: 'C语言' }
];

// Left组件，包含Buttons组件用于筛选操作，接收点击事件处理函数属性
interface LeftProps {
    onMenuButtonClick: (buttonId: string) => void;
}

export const Left: React.FC<LeftProps> = ({ onMenuButtonClick }) => {
    // 定义状态来记录当前激活的按钮ID
    const [activeButtonId, setActiveButtonId] = useState<string>('首页');

    const handleMenuClick = (buttonId: string) => {
        // 更新当前激活的按钮ID
        setActiveButtonId(buttonId);
        // 调用父组件传递的点击事件处理函数
        onMenuButtonClick(buttonId);
    };

    return (
        <div className="left">
            <div className="menuCon">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        id={item.id}
                        className={`MenuButton ${item.id === activeButtonId ? 'clicked' : ''}`}
                        onClick={() => handleMenuClick(item.id)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
