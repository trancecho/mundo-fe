import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from '@arco-design/web-react'
import styles from '../Navbar.module.css'

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
    <div className='menu-demo w-full overflow-x-auto'>
      <Menu
        mode={'horizontal'}
        className={styles.navbar}
        selectedKeys={[currentPath || '']}
        onClickMenuItem={key => navigate(`/datastation/${key}`)}
        style={{
          width: '100%',
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          height: '100%'
        }}
        theme='dark'
        ellipsis={false}
      >
        {categories.map(({ path, label }) => (
          <Menu.Item key={path}>{label}</Menu.Item>
        ))}
      </Menu>
    </div>
  )
}

export default Navbar
