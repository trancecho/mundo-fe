import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoSearchOutline } from 'react-icons/io5'
import styles from './MobileHeader.module.css'
import { useAuth } from '../../context/AuthContext'
import { getAvatar } from '@/router/api'
import { IconExport, IconClose, IconSearch } from '@arco-design/web-react/icon'
import { Modal, Button, Input, Dropdown, Menu as NavManu } from '@arco-design/web-react'
import { useSearch } from '../Header/SearchContext'
import Menu from './MobileMenu'
const MobileHeader: React.FC = () => {
  const { searchText, setSearchText } = useSearch()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { longtoken } = useAuth()
  const [visible, setVisible] = React.useState(false)
  const DEFAULT_AVATAR =
    'https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg'
  const [avatar, setAvatar] = useState<string | null>(DEFAULT_AVATAR)



  // const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = event => {
  //   setSearchText(event.target.value)
  // }
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (!longtoken) {
          return
        }
        const avatarBlob = await getAvatar(longtoken as string)
        if (!avatarBlob) {
          setAvatar(DEFAULT_AVATAR)
          return
        }
        if (avatar) {
          URL.revokeObjectURL(avatar)
        }
        const avatarUrl = URL.createObjectURL(avatarBlob)
        setAvatar(avatarUrl)
      } catch (error) {
        console.error('获取头像失败', error)
        setAvatar(DEFAULT_AVATAR)
      }
    }
    fetchAvatar()
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatar)
      }
    }
  }, [longtoken])

  const onSearch = () => {
    const currentPath = location.pathname
    const trimmedSearchText = searchText.trim()
    setSearchText(trimmedSearchText)

    if (currentPath.startsWith('/teamup')) {
      const searchEvent = new CustomEvent('doTeamSearch', {
        detail: { searchText: trimmedSearchText }
      })
      window.dispatchEvent(searchEvent)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const getSearchPlaceholder = () => {
    // const currentPath = location.pathname
    return ""
    // if (currentPath.startsWith('/article')) {
    //   return '搜索文章...'
    // } else if (currentPath.startsWith('/qa')) {
    //   return '搜索问答...'
    // } else if (currentPath.startsWith('/teamup')) {
    //   return '搜索组队...'
    // }
    // return '搜索内容...'
  }

  const handleAvatarClick = () => {
    if (!longtoken) {
      navigate('/login')
    } else {
      setIsUserMenuOpen(!isUserMenuOpen)
    }
  }
  const dropList = (
    <NavManu>
      <NavManu.Item key='1' onClick={() => navigate('/info')}>个人主页</NavManu.Item>
      <NavManu.Item key='2' onClick={() => navigate('/center')}>创作者中心</NavManu.Item>
      <NavManu.Item key='3' onClick={() => setVisible(true)}>登出</NavManu.Item>
    </NavManu>
  )
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          MUNDO
        </div>
        <div className={`${styles.searchWrapper} ${isFocused ? styles.focused : ''}`}>
          <Input
            allowClear
            type='text'
            placeholder={getSearchPlaceholder()}
            value={searchText}
            onChange={(value) => setSearchText(value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPressEnter={onSearch}
            className={styles.searchInput}
          />
          <div className={styles.searchButton} onClick={onSearch}>
            <IconSearch />
          </div>
        </div>
        <div className={styles.userActions}>
          {!longtoken ? (
            <>
              <Button className={`${styles.authButton} ${styles.registerButton}`} onClick={() => navigate('/login')}>
                登录
              </Button>
            </>
          ) : (
            <>
              <Dropdown droplist={dropList} trigger='click' position='bl'>
                <div className={styles.avatar}>
                  <img
                    src={avatar || DEFAULT_AVATAR}
                    alt='头像'
                    className='w-full h-full object-cover rounded-full'
                  />
                </div>
              </Dropdown>
            </>
          )}
          <Modal
            title={
              null
            }
            mask={true}
            maskClosable={true}
            maskStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              pointerEvents: 'auto'
            }}
            visible={visible}
            onCancel={() => setVisible(false)}
            onOk={() => {
              setVisible(false)
              localStorage.setItem('longtoken', '')
              navigate('/')
            }}
            closable={true}
            className=' w-auto max-w-[300px] z-[1000] rounded-lg'
            focusLock={true}
            footer={null}
          >
            <div className='flex flex-col w-full gap-[10px]'>
              <div className='flex items-center justify-center w-full '>
                <div className='text-[18px] font-medium text-white ml-[20px]'>
                  确定要退出登录吗？
                </div>
              </div>
              <div className='flex items-center justify-center gap-[40px] w-full'>
                <Button
                  key='cancel'
                  type='dashed'
                  className='px-4 py-2 mr-3 text-sm font-medium bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-200'
                  onClick={() => setVisible(false)}
                >
                  取消
                </Button>
                <Button
                  key='ok'
                  type='primary'
                  onClick={() => {
                    setVisible(false)
                    localStorage.setItem('longtoken', '')
                    navigate('/')
                  }}
                >
                  确定
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </header>
      <footer className={styles.footer}>
        <Menu />
      </footer>
    </>
  )
}

export default MobileHeader
