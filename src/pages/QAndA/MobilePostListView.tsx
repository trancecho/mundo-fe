import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Post.css'
import { Notification } from '@arco-design/web-react'
import { Menu } from '@arco-design/web-react'
import { IconApps, IconBug, IconBulb } from '@arco-design/web-react/icon'
import { useTagsMenu } from './hooks/useTagsMenu'
import { Tabs, Pagination } from '@arco-design/web-react'
import { IconCalendar, IconClockCircle, IconUser } from '@arco-design/web-react/icon'
import { usePostList } from './hooks/usePostData'
import PostList from './MobilePostList'
import { Post } from '@/interfaces/post'
const TabPane = Tabs.TabPane
const PostListView: React.FC = () => {
  const { SubMenu, Item: MenuItem } = Menu
  const navigate = useNavigate()
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

  const total = data?.pageInfo.total || 0
  const postList = data?.posts || ([] as Array<Post>)

  useEffect(() => {
    console.log("this is mobile post list view")
  }, [])

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

  const handleMessageClick = (messageId: number) => {
    let longtoken = localStorage.getItem('longtoken')
    if (!longtoken) {
      Notification.info({
        closable: false,
        title: '请先登录',
        content: '请先登录后再进行操作。'
      })
      return
    }
    navigate(`/qanda/${messageId}`)
  }
  const { tagsGrouped, loading } = useTagsMenu()

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
      <div className='mobileQandAContainer'>
        <div
          style={{
            height: '40px',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <div className='menu-demo w-full overflow-x-auto'>
            <Menu
              mode={'horizontal'}
              style={{
                width: '100%',
                display: 'inline-flex',
                whiteSpace: 'nowrap',
                height: '100%'
              }}
              defaultOpenKeys={['0']}
              defaultSelectedKeys={['0']}
              theme='dark'
              // collapse={false}
              // hasCollapseButton={false}
              ellipsis={false}
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
              <MenuItem key={`0`}>综合</MenuItem>
              {Object.entries(tagsGrouped || {}).map(([category, tags], catIndex) =>
                tags?.map((tag, tagIndex) => (
                  <MenuItem key={`${catIndex}_${tagIndex}` as string}>
                    {tag.name || '未命名标签'}
                  </MenuItem>
                ))
              )}
            </Menu>
          </div>
        </div>
        <div className='mobileRight flex flex-col w-full gap-[16px]'>
          <Tabs
            activeTab={sortby}
            onChange={key => {
              setSortby(key)
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
  )
}

export default PostListView
