import React, { useState } from "react";
import styles from './Item.module.css';

interface ItemProps {
  item: {
    id: number;
    name: string;
    updated_at: string;
    folder_id: number;
    hotness: number;
    size: number;
    url: string;  
    isDownloading?: boolean;
    isDownloaded?: boolean;
  };
  onDownload: (item: any) => void; // 下载处理函数
}

const Item: React.FC<ItemProps> = ({ item, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sizeInMB = (item.size / 1024 / 1024).toFixed(2);    // 将文件大小转换为 MB，并保留两位小数

  // 格式化日期，返回 yyyy-mm-dd
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getButtonText = () => {
    if (item.isDownloading) return "正在下载...";
    if (item.isDownloaded) return "已下载";
    return "点击下载";
  };

  const handleItemClick = () => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div 
      className={`${styles.item} ${item.url ? styles.hasUrl : ''} ${isHovered && item.url ? styles.hoveredWithUrl : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleItemClick}
      style={{ cursor: item.url ? 'pointer' : 'default' }}
    >
      <div className={styles.mainContent}>
        <h3 className={styles.title}>{item.name}</h3>
        <p>文件大小: {sizeInMB} MB</p>
        <p>
          下载链接:  
          <button 
            className={styles.downloadButton} 
            onClick={() => onDownload(item)}
            disabled={item.isDownloading || item.isDownloaded}
          >
            {getButtonText()}
          </button>
        </p>
        <p>更新时间: {formatDate(item.updated_at)}</p>
      </div>
      <div className={styles.hotness}>热度: {item.hotness}</div>
    </div>
  );
};

export default Item;
