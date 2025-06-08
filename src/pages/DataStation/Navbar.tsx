import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconApps } from '@arco-design/web-react/icon'
import styles from './Navbar.module.css'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.split('/').pop()

  const categories = [
    { path: 'math1', label: '高数上' },
    { path: 'math2', label: '高数下' },
    { path: 'physics1', label: '大物上' },
    { path: 'physics2', label: '大物下' },
    { path: 'c-language', label: 'C语言' },
    { path: 'others', label: '其他' }
  ]

  return (
    <div className={styles.navbar}>
      {categories.map(({ path, label }) => (
        <div
          key={path}
          className={`${styles.navItem} ${currentPath === path ? styles.active : ''}`}
          onClick={() => navigate(`/datastation/${path}`)}
        >
          <IconApps /> {label}
        </div>
      ))}
    </div>
  )
}

export default Navbar
