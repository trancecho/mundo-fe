import React, { useState } from 'react';
import '../../style/Header.css';

//Header组件，包含搜索框功能，接收搜索框输入变化和搜索按钮点击的事件处理函数属性
interface HeaderProps {
    onSearchChange: React.ChangeEventHandler<HTMLInputElement>;
    onSearch: () => void;
}

interface LeftProps {
    onHeaderMenuButtonClick: (buttonId: string) => void;
}

const Menu: React.FC<LeftProps> = ({ onHeaderMenuButtonClick }) => {
    // 使用useState钩子为每个按钮创建一个状态，用于记录是否被点击，初始值都为false
    const [isHomeClicked, setIsHomeClicked] = useState(true);
    const [isMenu1Clicked, setIsMenu1Clicked] = useState(false);
    const [isMenu2Clicked, setIsMenu2Clicked] = useState(false);
    const [isMenu3Clicked, setIsMenu3Clicked] = useState(false);

    return (
        <div className='HeaderMenu'>
            <button
                id="答疑"
                className={`HeaderMenuButton ${isHomeClicked? 'clicked' : ''}`}
                onClick={() => {
                    setIsHomeClicked(true);
                    // 将其他按钮的点击状态设为false，确保只有一个按钮处于点击态（如果有这样的需求）
                    setIsMenu1Clicked(false);
                    setIsMenu2Clicked(false);
                    setIsMenu3Clicked(false);
                    onHeaderMenuButtonClick('答疑');
                }}
            >答疑</button>
            <button
                id="论坛"
                className={`HeaderMenuButton ${isMenu1Clicked? 'clicked' : ''}`}
                onClick={() => {
                    setIsMenu1Clicked(true);
                    setIsHomeClicked(false);
                    setIsMenu2Clicked(false);
                    setIsMenu3Clicked(false);
                    onHeaderMenuButtonClick('论坛');
                }}
            >论坛</button>
            <button
                id="组队"
                className={`HeaderMenuButton ${isMenu2Clicked? 'clicked' : ''}`}
                onClick={() => {
                    setIsMenu2Clicked(true);
                    setIsHomeClicked(false);
                    setIsMenu1Clicked(false);
                    setIsMenu3Clicked(false);
                    onHeaderMenuButtonClick('组队');
                }}
            >组队</button>
            <button
                id="资料"
                className={`HeaderMenuButton ${isMenu3Clicked? 'clicked' : ''}`}
                onClick={() => {
                    setIsMenu3Clicked(true);
                    setIsHomeClicked(false);
                    setIsMenu1Clicked(false);
                    setIsMenu2Clicked(false);
                    onHeaderMenuButtonClick('资料');
                }}
            >资料</button>
        </div>
    );
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, onSearch }) => {
    return (
        <div className="Header">
            <div className='Name'>MUNDO</div>
            {/* 在这里引入Menu组件，并传递onMenuButtonClick函数 */}
            <Menu onHeaderMenuButtonClick={(buttonId) => {
                console.log(`点击了菜单按钮: ${buttonId}`);
                // 这里可以根据实际需求完善点击菜单按钮后的具体逻辑，比如更新状态、发起请求等
            }} />
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="请输入搜索内容"
                    onChange={onSearchChange}
                    className="search-input"
                />
            </div>
            <div>
                <button className='user'>创作者中心</button>
            </div>
            <div className="avatar"></div>
        </div>
    );
}

export default Header;