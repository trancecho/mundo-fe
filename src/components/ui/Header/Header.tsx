import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Menu from './Menu';

const Header: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const navigate = useNavigate();

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.target.value);
    };

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
                    value={searchText}
                    onChange={onSearchChange}
                    className="search-input"
                />
                <button className="search-button" onClick={onSearch}>
                    搜索
                </button>
            </div>
            <div>
                <div
                    className="user"
                    onClick={() => navigate("/center")}
                >
                    创作者中心
                </div>
            </div>
            <div className="avatar"></div>
        </div>
    );
};

export default Header;
