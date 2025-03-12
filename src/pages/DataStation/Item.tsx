import React from "react";
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
  };
  onDownload: (item: any) => void;  // 下载处理函数
}

const Item: React.FC<ItemProps> = ({ item, onDownload }) => {
  const sizeInMB = (item.size / 1024 / 1024).toFixed(2);    // 将文件大小转换为 MB，并保留两位小数

  // 格式化日期，返回 yyyy-mm-dd
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.item}>
      <h3 className={styles.title}>{item.name}</h3>
      <p>文件大小: {sizeInMB} MB</p>
      <p>
        下载链接:  
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer">点击下载</a>
        ) : (
          <button className={styles.downloadButton} onClick={() => onDownload(item)}>
            点击下载
          </button>
        )}
      </p>
      <p>热度: {item.hotness}</p>
      <p>更新时间: {formatDate(item.updated_at)}</p>
    </div>
  );
};

export default Item;
