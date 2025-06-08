import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from '@arco-design/web-react'
import styles from './Navbar.module.css'
import MobileNavbar from './mobile/MobileNavbar'
const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.split('/').pop()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const categories = [
    { path: 'math1', label: '高数上' },
    { path: 'math2', label: '高数下' },
    { path: 'physics1', label: '大物上' },
    { path: 'physics2', label: '大物下' },
    { path: 'c-language', label: 'C语言' },
    { path: 'others', label: '其他' }
  ]

  return (
    <>
      <Menu
        className={styles.navbar}
        selectedKeys={[currentPath || '']}
        onClickMenuItem={key => navigate(`/datastation/${key}`)}
        style={{ width: '16rem' }}
        theme='dark'
      >
        {categories.map(({ path, label }) => (
          <Menu.Item key={path}>{label}</Menu.Item>
        ))}
      </Menu>
    </>
  )
}

export default Navbar
