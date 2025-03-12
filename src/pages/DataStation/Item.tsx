import React from "react";
import styles from './Item.module.css';
import { useState, Dispatch, SetStateAction } from "react";

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
  const [downloading, setDownloading] = useState(false);

  const sizeInMB = (item.size / 1024 / 1024).toFixed(2);    // 将文件大小转换为 MB，并保留两位小数

  // 格式化日期，返回 yyyy-mm-dd
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDownload = async (url: string, setDownloading: Dispatch<SetStateAction<boolean>>) => {
    try {
      setDownloading(true); // 开始下载
      const response = await fetch(url);
      if (!response.ok) throw new Error("下载失败");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "download.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("下载失败:", error);
    } finally {
      setDownloading(false); // 下载完成或失败时重置状态
    }
  };

  return (
    <div className={styles.item}>
      <h3 className={styles.title}>{item.name}</h3>
      <p><span className={styles.boldertext}>文件大小</span>: {sizeInMB} MB</p>
      <p>
        <span className={styles.boldertext}>下载链接: </span>
        {item.url ? (

          <>
            <button onClick={() => handleDownload(item.url, setDownloading)} className={styles.downloadButton}
              disabled={downloading}>
              {downloading ? "正在下载..." : "点击下载"}
            </button>
            <a className={styles.downloadButton} href={item.url} target="_blank" rel="noopener noreferrer">点击预览</a>
          </>
          
        ) : (
          <button className={styles.getDownloadButton} onClick={() => onDownload(item)}>
            请求下载
          </button>
        )}
      </p>
      <p><span className={styles.boldertext}>热度</span>: {item.hotness}</p>
      <p><span className={styles.boldertext}>更新时间</span>: {formatDate(item.updated_at)}</p>
    </div>
  );
};

export default Item;
