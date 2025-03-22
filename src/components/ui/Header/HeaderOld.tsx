import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

//Header组件，包含搜索框功能，接收搜索框输入变化和搜索按钮点击的事件处理函数属性
interface HeaderProps {
    onSearchChange: React.ChangeEventHandler<HTMLInputElement>;
    onSearch: () => void;
}

interface LeftProps {
    onHeaderMenuButtonClick: (buttonId: string) => void;
}

const Menu: React.FC<LeftProps> = () => {
    // 使用useState钩子为每个按钮创建一个状态，用于记录是否被点击，初始值都为false
    // const [isHomeClicked, setIsHomeClicked] = useState(true);
    // const [isMenu1Clicked, setIsMenu1Clicked] = useState(true);
    // const [isMenu2Clicked, setIsMenu2Clicked] = useState(true);
    // const [isMenu3Clicked, setIsMenu3Clicked] = useState(true);

    const[activateMenu,setActivateMenu] = useState<string>('问答');
    const navigate = useNavigate();

    const handleMenuClick=(menu:string,path:string)=>{
        setActivateMenu(menu);
        navigate(path);
    }


    return (
        <div className='HeaderMenu'>
            <div
                // id="答疑"
                className={`HeaderMenuButton ${activateMenu == "答疑" ? 'clicked' : ''}`}
                onClick={() => {
                    // setIsHomeClicked(true);
                    // setIsMenu1Clicked(false);
                    // setIsMenu2Clicked(false);
                    // setIsMenu3Clicked(false);
                    handleMenuClick('答疑', '/qanda');
                    // onHeaderMenuButtonClick('答疑');
                    // navigate('/qanda');
                }}
            >答疑
            </div>
            <div
                // id="论坛"
                className={`HeaderMenuButton ${activateMenu == "论坛" ? 'clicked' : ''}`}
                onClick={() => {
                    // setIsMenu1Clicked(true);
                    // setIsHomeClicked(false);
                    // setIsMenu2Clicked(false);
                    // setIsMenu3Clicked(false);
                    // onHeaderMenuButtonClick('论坛');
                    // navigate('/forum');
                    handleMenuClick('论坛', '/forum');
                }}
            >论坛
            </div>
            <div
                // id="组队"
                className={`HeaderMenuButton ${activateMenu == "组队" ? 'clicked' : ''}`}
                onClick={() => {
                    // setIsMenu2Clicked(true);
                    // setIsHomeClicked(false);
                    // setIsMenu1Clicked(false);
                    // setIsMenu3Clicked(false);
                    // onHeaderMenuButtonClick('组队');
                    // navigate('/teamup');
                    handleMenuClick('组队', '/teamup');
                }}
            >组队
            </div>
            <div
                // id="资料"
                className={`HeaderMenuButton ${activateMenu == "资料" ? 'clicked' : ''}`}
                onClick={() => {
                    // setIsMenu3Clicked(true);
                    // setIsHomeClicked(false);
                    // setIsMenu1Clicked(false);
                    // setIsMenu2Clicked(false);
                    // onHeaderMenuButtonClick('资料');
                    // navigate('/datastation');
                    handleMenuClick('资料', '/datastation');
                }}
            >资料
            </div>
            <div
                className={`HeaderMenuButton ${activateMenu == "timerme" ? 'clicked' : ''}`}
                onClick={() => {
                    handleMenuClick('timerme', '/timerme');
                }}
            >timerme
            </div>
        </div>
    );
}

const Header: React.FC<HeaderProps> = ({onSearchChange, onSearch}) => {
    const navigate = useNavigate();
    return (
        <div className="Header">
            <div className='Name'>MUNDO</div>
            {/* 在这里引入Menu组件，并传递onMenuButtonClick函数 */}
            {/*<Menu onHeaderMenuButtonClick={(buttonId) => {*/}
            {/*    console.log(`点击了菜单按钮: ${buttonId}`);*/}
            {/*    // 这里可以根据实际需求完善点击菜单按钮后的具体逻辑，比如更新状态、发起请求等*/}
            {/*}} />*/}

            <Menu/>
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="请输入搜索内容"
                    onChange={onSearchChange}
                    className="search-input"
                />
            </div>
            <div>
                <div className='user' onClick={()=>{
                    navigate("/center");
                }}>创作者中心</div>
            </div>
            <div className="avatar"></div>
        </div>
    );
}

// export default Header;
