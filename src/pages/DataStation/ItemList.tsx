import React, { useEffect, useState } from 'react'
import Item from './Item'
import { getFileList, downloadFile, previewFile } from '@/router/api'
import styles from './ItemList.module.css'
import { useSearch } from '@/components/Header/SearchContext'
import { Pagination, Tabs, Spin } from '@arco-design/web-react'
import { IconFire, IconClockCircle } from '@arco-design/web-react/icon'
import MobileItemList from './mobile/MobileItemList'
interface ItemListProps {
  category: string
}

interface ItemData {
  id: number
  name: string
  folder_id: number
  hotness: number
  size: number
  isDownloading?: boolean
  isDownloaded?: boolean
}

const ItemList: React.FC<ItemListProps> = ({ category }) => {
  const [items, setItems] = useState<ItemData[]>([])
  const [selectedTab, setSelectedTab] = useState<'hot' | 'new'>('hot')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { searchText } = useSearch()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 10
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getFileList(category, currentPage, pageSize, selectedTab)
        if (response.code === 200) {
          const fileData =
            selectedTab === 'hot' ? response.data.sortby.hot : response.data.sortby.new
          setItems(fileData || [])
          setTotal(response.data.pagination.total)
        }
      } catch (error: any) {
        console.error('Error fetching data:', error)
        if (error.response?.status === 500) {
          setError('登陆后即可查看资料！若已登陆，请刷新页面～')
        } else {
          setError('获取资料失败，请刷新页面或稍后再试')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category, currentPage, selectedTab])

  const handleSort = (tab: 'hot' | 'new') => {
    setSelectedTab(tab)
    setCurrentPage(1) // 切换排序时重置页码
  }

  const updateItems = (updateFn: (items: ItemData[]) => ItemData[]) => {
    setItems(prev => updateFn(prev))
  }

  const handleDownload = async (item: ItemData) => {
    if (item.isDownloading || item.isDownloaded) return

    try {
      const response = await downloadFile(item.id)
      if (response.code === 200) {
        updateItems(items =>
          items.map(i => (i.id === item.id ? { ...i, isDownloading: true } : i))
        )

        const fileUrl = response.data.downloadUrl

        const fileResponse = await fetch(fileUrl)
        if (!fileResponse.ok) {
          throw new Error('文件下载失败')
        }

        const blob = await fileResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = item.name
        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)

        updateItems(items =>
          items.map(i =>
            i.id === item.id ? { ...i, isDownloading: false, isDownloaded: true } : i
          )
        )
      }
    } catch (error) {
      updateItems(items =>
        items.map(i => (i.id === item.id ? { ...i, isDownloading: false } : i))
      )
    }
  }

  const handlePreview = async (item: ItemData) => {
    try {
      const response = await previewFile(item.id)
      if (response.code === 200) {
        const previewUrl = response.data.previewUrl
        return previewUrl
      } else {
        throw new Error(response.msg || '获取预览链接失败')
      }
    } catch (error) {
      console.error('预览失败:', error)
      throw error
    }
  }

  return (
    <>
      {isMobile ? (
        <MobileItemList category={category} />
      ) : (
        <div className={styles.container}>
          <Tabs
            activeTab={selectedTab} // 将 defaultActiveTab 改为 activeTab
            onChange={key => handleSort(key as 'hot' | 'new')}
          >
            <Tabs.TabPane
              key='hot'
              title={
                <span>
                  <IconFire style={{ marginRight: 6 }} />
                  最热
                </span>
              }
            />
            <Tabs.TabPane
              key='new'
              title={
                <span>
                  <IconClockCircle style={{ marginRight: 6 }} />
                  最新
                </span>
              }
            />
          </Tabs>

          <div className={styles.itemList}>
            {error ? (
              <p>{error}</p>
            ) : loading ? (
              <div
                style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}
              >
                <Spin />
              </div>
            ) : items.length === 0 ? (
              <p>没有资料</p>
            ) : (
              items.map(item => (
                <Item
                  key={item.id}
                  item={item}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                />
              ))
            )}
          </div>

          {total > 0 && (
            <div className={styles.paginationContainer}>
              <Pagination
                total={total}
                current={currentPage}
                pageSize={pageSize}
                onChange={page => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ItemList
