import React, { useState } from 'react'
import styles from './Item.module.css'

interface ItemProps {
  item: {
    id: number
    name: string
    updated_at: string
    folder_id: number
    hotness: number
    size: number
    url?: string
    previewUrl?: string
    isDownloading?: boolean
    isDownloaded?: boolean
  }
  onDownload: (item: any) => void
  onPreview: (item: any) => Promise<string> // 新增预览处理函数
}

const Item: React.FC<ItemProps> = ({ item, onDownload, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const sizeInMB = (item.size / 1024 / 1024).toFixed(2)

  // 格式化日期，返回 yyyy-mm-dd
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (item.previewUrl) {
      window.open(item.previewUrl, '_blank')
      return
    }

    try {
      setIsLoadingPreview(true)
      const previewUrl = await onPreview(item)
      window.open(previewUrl, '_blank')
    } catch (error) {
      setPreviewError('预览加载失败，请稍后重试')
      setTimeout(() => setPreviewError(null), 3000)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发预览
    onDownload(item)
  }

  return (
    <div
      className={`${styles.itemContainer}` + (isHovered ? ` ${styles.hovered}` : '')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePreview}
    >
      <div className={styles.mainContent}>
        <h3 className={styles.title}>{item.name}</h3>
        <p>文件大小: {sizeInMB} MB</p>
        <p>
          下载链接:
          <button
            className={`${styles.downloadButton} ${
              item.isDownloading
                ? styles.downloading
                : item.isDownloaded
                  ? styles.downloaded
                  : ''
            }`}
            onClick={handleDownloadClick}
            disabled={item.isDownloading || item.isDownloaded}
          >
            {item.isDownloading
              ? '正在下载...'
              : item.isDownloaded
                ? '已下载'
                : '点击下载'}
          </button>
        </p>
        <p>更新时间: {formatDate(item.updated_at)}</p>
        {isLoadingPreview && <span>加载预览中...</span>}
        {previewError && <span style={{ color: 'red' }}>{previewError}</span>}
      </div>
      <div className={styles.hotness}>热度: {item.hotness}</div>
    </div>
  )
}

export default Item
