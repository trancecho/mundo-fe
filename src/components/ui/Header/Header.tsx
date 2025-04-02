import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import styles from './Header.module.css';
import Menu from './Menu';
import UserMenu from './UserMenu';
import { useAuth } from '../../../context/AuthContext';
import { getAvatar } from '@/router/api';
import { useSearch } from './SearchContext';

const Header: React.FC = () => {
    const { searchText, setSearchText } = useSearch();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { longtoken } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);
    const DEFAULT_AVATAR =
        "https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg";
    const [avatar, setAvatar] = useState<string | null>(DEFAULT_AVATAR);

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
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const avatarBlob = await getAvatar(longtoken as string);
                if (!avatarBlob) {
                    setAvatar(DEFAULT_AVATAR);
                    return;
                }
                if (avatar) {
                    URL.revokeObjectURL(avatar);
                }
                const avatarUrl = URL.createObjectURL(avatarBlob);
                setAvatar(avatarUrl);
            } catch (error) {
                console.error("获取头像失败", error);
                setAvatar(DEFAULT_AVATAR);
            }
        };
        fetchAvatar();
        return () => {
            if (avatar) {
                URL.revokeObjectURL(avatar);
            }
        };
    }, [longtoken]);
    const onSearch = () => {
        if (searchText.trim()) {
            const currentPath = location.pathname;
            if (currentPath.startsWith('/article')) {
                setSearchText(searchText.trim());  // 更新搜索文本
            } else if (currentPath.startsWith('/qa')) {
                setSearchText(searchText.trim());
            } else if (currentPath.startsWith('/teamup')) {
                setSearchText(searchText.trim());
            } else {
                setSearchText(searchText.trim());
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
                            onClick={() => navigate("/info")}
                        // onClick={handleAvatarClick}
                        >
                        <img
                            src={avatar ? avatar : DEFAULT_AVATAR}
                            alt="头像"
                            className="w-full h-full object-cover rounded-full" />
                        </div>
                        {/* {isUserMenuOpen && <UserMenu />} */}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
