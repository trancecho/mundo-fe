import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
  };

  const handleLogout = () => {
    // TODO: 实现登出逻辑
    console.log('用户登出');
    onClose();
  };

  return (
    <div className={styles.userMenuOverlay} onClick={onClose}>
      <div className={styles.userMenu} onClick={e => e.stopPropagation()}>
        <div className={styles.menuItem} onClick={handleProfileClick}>
          <span>个人主页</span>
        </div>
        <div className={styles.menuDivider} />
        <div className={styles.menuItem} onClick={handleLogout}>
          <span>退出登录</span>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;