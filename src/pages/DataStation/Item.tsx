import React, { useState } from 'react'
import styles from './Item.module.css'

interface ItemProps {
  item: {
    id: number
    name: string
    folder_id: number
    hotness: number
    size: number
    isDownloading?: boolean
    isDownloaded?: boolean
  }
  onDownload: (item: any) => void
  onPreview: (item: any) => Promise<string>
}

const Item: React.FC<ItemProps> = ({ item, onDownload, onPreview }) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const sizeInMB = (item.size / 1024 / 1024).toFixed(2)

  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation()

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
    e.stopPropagation()
    onDownload(item)
  }

  return (
    <div className={styles.itemContainer}>
      <div className={styles.mainContent}>
        <h3 className={styles.title}>{item.name}</h3>
        <div className={styles.textp}>文件大小: {sizeInMB} MB</div>
        <div className='flex w-full justify-between items-center'>
          <div className={styles.textspan}>热度: {item.hotness}</div>
          <div className={styles.previewButtonContainer}>
            <button className={styles.previewButton} onClick={handlePreview}>
              预览
            </button>
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
          </div>
        </div>
        {isLoadingPreview && <div className={styles.textspan}>加载预览中...</div>}
        {previewError && (
          <div className={styles.textspan} style={{ color: 'red' }}>
            {previewError}
          </div>
        )}
      </div>
    </div>
  )
}

export default Item
