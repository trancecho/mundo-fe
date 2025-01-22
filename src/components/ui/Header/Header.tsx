import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // 假设有对应的CSS文件来管理样式
import Menu from './Menu'; // 引入 Menu 组件

const Header: React.FC = () => {
    const [searchText, setSearchText] = useState<string>(''); // 用于保存搜索框的输入
    const navigate = useNavigate();

    // 处理搜索框内容变化
    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.target.value); // 更新搜索框输入的内容
    };

    // 处理搜索操作
    const onSearch = () => {
        console.log('执行搜索:', searchText);
        // 在这里你可以根据搜索的内容进行相关操作，如发起请求等
        // 例如：navigate(`/search?query=${searchText}`);
    };

    return (
        <div className="Header">
            <div className="Name">MUNDO</div>
            <Menu />
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="请输入搜索内容"
                    value={searchText} // 绑定搜索框的值
                    onChange={onSearchChange} // 处理输入框的变化
                    className="search-input"
                />
                <button onClick={onSearch}>搜索</button>
            </div>
            <div>
                <div
                    className="user"
                    onClick={() => navigate("/center")} // 跳转到创作者中心
                >
                    创作者中心
                </div>
            </div>
            <div className="avatar"></div>
        </div>
    );
}

export default Header;
