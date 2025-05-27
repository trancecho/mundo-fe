import React, { useEffect, useState } from "react";
import Item from "./Item";
import { getFileList, downloadFile,previewFile } from "@/router/api";
import styles from './ItemList.module.css';

interface ItemListProps {
  category: string;
}

interface ItemData {
  id: number;
  name: string; // 文件名
  updated_at: string; // 更新时间
  folder_id: number; // 文件夹 ID
  hotness: number;
  size: number;
  url: string; // 下载链接
  isDownloading?: boolean; // 是否正在下载
  isDownloaded?: boolean; // 是否已下载
}

const ItemList: React.FC<ItemListProps> = ({ category }) => {
  const [originalItems, setOriginalItems] = useState<ItemData[]>([]); // 保存原始数据
  const [sortedItems, setSortedItems] = useState<ItemData[]>([]); // 用于展示的排序后数据
  const [selectedTab, setSelectedTab] = useState<string>("hot");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let queries: string[] = [];
    
    // 根据 category 设置查询
    switch(category) {
      case "高数":
        queries = ["高数上", "高数下"];
        break;
      case "大物":
        queries = ["大物上", "大物下"];
        break;
      case "C语言":
        queries = ["C语言"];
        break;
      case "其他":
        queries = ["其它"];
        break;
    }

    // 发送多个请求
    Promise.all(
      queries.map((name) => getFileList(name)
      )
    )
      .then((responses) => {
        const fetchedItems = responses.flat(); // 合并所有响应的数据照热度排序
        setOriginalItems(fetchedItems);
        setSortedItems(getSortedItems(fetchedItems, selectedTab));
        setLoading(false);
      })
      
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (error.response?.status === 500) {
          setError("登陆后即可查看资料！若已登陆，请刷新页面～");
        } else {
          setError("获取资料失败，请刷新页面或稍后再试");
        }
        setLoading(false);
      });
  }, [category]);

  // 排序逻辑抽取为独立函数
  const getSortedItems = (items: ItemData[], tab: string) => {
    const sorted = [...items];
    if (tab === "hot") {
      return sorted.sort((a, b) => b.hotness - a.hotness);
    } else if (tab === "new") {
      return sorted.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
    return sorted;
  };

  // 处理排序切换
  const handleSort = (tab: string) => {
    setSelectedTab(tab);
    setSortedItems(getSortedItems(originalItems, tab));
  };

  const updateItems = (updateFn: (items: ItemData[]) => ItemData[]) => {
    setOriginalItems(prev => {
      const newItems = updateFn(prev);
      setSortedItems(getSortedItems(newItems, selectedTab));
      return newItems;
    });
  };

  const handleDownload = async (item: ItemData) => {
    if (item.isDownloading || item.isDownloaded) return;

    try {
      const response = await downloadFile(item.id);
      if (response.code === 200) {
        // 设置下载中状态
        updateItems(items => items.map(i =>
          i.id === item.id ? { ...i, isDownloading: true } : i
        ));

        const fileUrl = response.data.previewUrl;

        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
          throw new Error('文件下载失败');
        }

        const blob = await fileResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        
        // 清理
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        // 设置完成状态
        updateItems(items => items.map(i =>
          i.id === item.id ? { 
            ...i, 
            url: fileUrl,
            isDownloading: false,
            isDownloaded: true 
          } : i
        ));
      }
    } catch (error) {
      updateItems(items => items.map(i =>
        i.id === item.id ? { ...i, isDownloading: false } : i
      ));
    }
  };

  const handlePreview = async (item: ItemData) => {
    try {
      const response = await previewFile(item.id);
      if (response.code === 200) {
        const previewUrl = response.data.previewUrl;
        // 更新 items 状态,保存预览 URL
        setOriginalItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, previewUrl } : i
        ));
        return previewUrl;
      } else {
        throw new Error(response.msg || '获取预览链接失败');
      }
    } catch (error) {
      console.error('预览失败:', error);
      throw error;
    }
  };

  if (loading) return <p>加载中....</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleSort("hot")}
          className={`${styles.button} ${selectedTab === "hot" ? styles.activeButton : ''}`}
        >
          最热
        </button>
        <button
          onClick={() => handleSort("new")}
          className={`${styles.button} ${selectedTab === "new" ? styles.activeButton : ''}`}
        >
          最新
        </button>
      </div>
      <div style={{ 
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        {sortedItems.length === 0 ? 
          <p>没有资料</p> : 
          sortedItems.map(item => (
            <Item 
              key={item.id} 
              item={item} 
              onDownload={handleDownload}
              onPreview={handlePreview}
            />
          ))
        }
      </div>
    </div>
  );
};




const styleSheet = document.createElement("style");
styleSheet.textContent = `
    button {
        transition: all 0.3s ease !important;
    }
    
    button:hover:not(:disabled) {
        transform: scale(1.05) !important;
    }
`;
document.head.appendChild(styleSheet);

export default ItemList;

