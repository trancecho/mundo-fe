import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import styles from './Header.module.css';
import Menu from './Menu';
import UserMenu from './UserMenu';
import { useAuth } from '../../../context/AuthContext';

const Header: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { longtoken } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.target.value);
    };

    const onSearch = () => {
        if (searchText.trim()) {
            const currentPath = location.pathname;
            if (currentPath.startsWith('/article')) {
                console.log('时文搜索:', searchText);
            } else if (currentPath.startsWith('/qa')) {
                console.log('问答搜索:', searchText);
            } else if (currentPath.startsWith('/teamup')) {
                console.log('组队搜索:', searchText);
            } else {
                console.log('全局搜索:', searchText);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const getSearchPlaceholder = () => {
        const currentPath = location.pathname;
        if (currentPath.startsWith('/article')) {
            return '搜索文章...';
        } else if (currentPath.startsWith('/qa')) {
            return '搜索问答...';
        } else if (currentPath.startsWith('/teamup')) {
            return '搜索组队...';
        }
        return '搜索内容...';
    };

    const handleAvatarClick = () => {
        if (!longtoken) {
            navigate('/login');
        } else {
            setIsUserMenuOpen(!isUserMenuOpen);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo} onClick={() => navigate('/')}>MUNDO</div>
            <Menu />
            <div className={`${styles.searchWrapper} ${isFocused ? styles.focused : ''}`}>
                <IoSearchOutline className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder={getSearchPlaceholder()}
                    value={searchText}
                    onChange={onSearchChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyPress={handleKeyPress}
                    className={styles.searchInput}
                />
                <button 
                    className={styles.searchButton}
                    onClick={onSearch}
                >
                    搜索
                </button>
            </div>
            <div className={styles.userActions}>
                {!longtoken ? (
                    <>
                        <button
                            className={styles.authButton}
                            onClick={() => navigate('/login')}
                        >
                            登录
                        </button>
                        <button
                            className={`${styles.authButton} ${styles.registerButton}`}
                            onClick={() => navigate('/register')}
                        >
                            注册
                        </button>
                    </>
                ) : (
                    <div ref={menuRef} className={styles.userMenuContainer}>
                        <div
                            className={styles.avatar}
                            onClick={handleAvatarClick}
                        />
                        {isUserMenuOpen && <UserMenu />}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
