import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Post.css'
import { Menu } from '@arco-design/web-react'
import { IconApps } from '@arco-design/web-react/icon'
import { useTagsMenu } from './hooks/useTagsMenu'
import { Tabs, Pagination } from '@arco-design/web-react'
import { IconCalendar, IconClockCircle, IconUser } from '@arco-design/web-react/icon'
import { usePostList } from './hooks/usePostData'
import PostList from './PostList'
import { Post } from '@/interfaces/post'
import MobilePostListView from './MobilePostListView'
const TabPane = Tabs.TabPane
const PostListView: React.FC = () => {
  const { SubMenu, Item: MenuItem } = Menu
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [category, setCategory] = useState('')
  const [sortby, setSortby] = useState('new')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const { data, isLoading } = usePostList({
    page,
    pageSize,
    category,
    search,
    sortby
  })
  const { tagsGrouped, loading } = useTagsMenu()
  const total = data?.pageInfo.total || 0
  const postList = data?.posts || ([] as Array<Post>)

  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ searchText: string }>) => {
      const searchQuery = event.detail.searchText
      setSearch(searchQuery)
      setPage(1)
    }

    window.addEventListener('doQandaSearch', handleSearch as EventListener)
    return () => {
      window.removeEventListener('doQandaSearch', handleSearch as EventListener)
    }
  }, [])
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // if (loading) return <div>加载中...</div>

  const keyToTagNameMap = useMemo(() => {
    const map = new Map<string, string>()
    map.set('0', '综合')
    Object.entries(tagsGrouped).forEach(([category, tags], catIndex) => {
      tags.forEach((tag, tagIndex) => {
        const key = `${catIndex}_${tagIndex}`
        map.set(key, tag.name)
      })
    })
    return map
  }, [tagsGrouped])
  return (
    <>
      {isMobile ? (
        <MobilePostListView />
      ) : (
        <>
          <div className='QandAContainer'>
            <div style={{ height: 600, marginLeft: '20px' }}>
              <Menu
                style={{ width: '16rem', height: '100%' }}
                defaultOpenKeys={['0']}
                defaultSelectedKeys={['0']}
                theme='dark'
                collapse={false}
                hasCollapseButton={false}
                className={'post-list-menu'}
                onClickMenuItem={(key, e) => {
                  const tagName = keyToTagNameMap.get(key)
                  if (tagName) {
                    if (tagName === '综合') {
                      setCategory('')
                    } else {
                      setCategory(tagName)
                    }
                    setPage(1)
                  }
                }}
              >
                <MenuItem key={`0`}>
                  {
                    <>
                      <IconApps /> <span className='mr-[16px]'>综合</span>
                    </>
                  }
                </MenuItem>
                {Object.entries(tagsGrouped).map(([category, tags], catIndex) => (
                  <SubMenu
                    key={String(catIndex)}
                    title={
                      <>
                        <IconApps /> {category}
                      </>
                    }
                  >
                    {tags.map((tag, tagIndex) => (
                      <MenuItem key={`${catIndex}_${tagIndex}`}>{tag.name}</MenuItem>
                    ))}
                  </SubMenu>
                ))}
              </Menu>
            </div>
            <div className='right flex flex-col w-full gap-[16px] mr-[20px]'>
              <Tabs
                activeTab={sortby ? sortby : 'default'}
                onChange={key => {
                  if (key === 'default') {
                    setSortby('')
                  } else {
                    setSortby(key)
                  }
                  setPage(1)
                }}
              >
                <TabPane
                  key='new'
                  title={
                    <>
                      <IconCalendar /> 最新
                    </>
                  }
                >
                  <PostList data={postList} loading={isLoading} />
                </TabPane>
                <TabPane
                  key='default'
                  title={
                    <>
                      <IconClockCircle /> 热门
                    </>
                  }
                >
                  <PostList data={postList} loading={isLoading} />
                </TabPane>
                <TabPane
                  key='noAnswer'
                  title={
                    <>
                      <IconUser /> 未回答
                    </>
                  }
                >
                  <PostList data={postList} loading={isLoading} />
                </TabPane>
                <TabPane
                  key='official'
                  title={
                    <>
                      <IconUser /> 官方
                    </>
                  }
                >
                  <PostList data={postList} loading={isLoading} />
                </TabPane>
              </Tabs>

              <div className='w-full items-center justify-center flex'>
                <Pagination
                  size='small'
                  total={total}
                  current={page}
                  pageSize={pageSize}
                  onChange={(current, size) => {
                    setPage(current)
                    setPageSize(size)
                  }}
                  style={{ textAlign: 'center' }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default PostListView
