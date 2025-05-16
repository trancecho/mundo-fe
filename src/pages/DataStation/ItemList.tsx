import React, { useEffect, useState } from "react";
import Item from "./Item";
import { getFileList, downloadFile } from "@/router/api";
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
  const [items, setItems] = useState<ItemData[]>([]);
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
        const fetchedItems = responses.flat(); // 合并所有响应的数据
        const sortedItems = fetchedItems.sort((a, b) => b.hotness - a.hotness); // 按照热度排序
        setItems(fetchedItems); // 更新 items 状态
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

  //排序
  useEffect(() => {
    let sortedItems = [...items];
    if (selectedTab === "hot") {
      sortedItems.sort((a, b) => b.hotness - a.hotness);
    } else if (selectedTab === "new") {
      sortedItems.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    setItems(sortedItems);
  }, [selectedTab]);

  useEffect(() => {
    //console.log('Fetched items:', items);  // 查看 items 数据
  }, [items]);


  const handleSort = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleDownload = async (item: ItemData) => {
    try {
      const response = await downloadFile(item.id);
      
      if (response.message === "生成下载链接成功") {
        const fileUrl = response.data.downloadUrl;
        const updateItems = items.map((i) =>
          i.id === item.id ? { 
            ...i, 
            url: response.data.downloadUrl,
            isDownloading: true
          } : i
        );
        setItems(updateItems);
        console.log(fileUrl);
        const fileResponse = await fetch(fileUrl);
        const blob = await fileResponse.blob();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        // 更新状态为已下载
        const newItems = items.map((i) =>
          i.id === item.id ? { 
            ...i, 
            url: response.data.url,
            isDownloading: false,
            isDownloaded: true 
          } : i
        );
        setItems(newItems);
      } else {
        // 如果下载失败，恢复按钮状态
        const newItems = items.map((i) =>
          i.id === item.id ? { ...i, isDownloading: false } : i
        );
        setItems(newItems);
        alert("下载失败，请稍后再试");
      }
    } catch (error) {
      // 发生错误时，恢复按钮状态
      const newItems = items.map((i) =>
        i.id === item.id ? { ...i, isDownloading: false } : i
      );
      setItems(newItems);
      console.error("下载请求失败:", error);
      alert("下载失败，请稍后再试");
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
        {items.length === 0 ? 
          <p>没有资料</p> : 
          items.map(item => <Item key={item.id} item={item} onDownload={handleDownload} />)
        }
      </div>
    </div>
  );
};

const tabStyle: React.CSSProperties = {
  marginRight: "20px",
  padding: "10px 20px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: "5px",
  backgroundColor: "balck",
  color: "#000",
  transition: "all 0.3s ease",
  transform: "scale(1)",
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  backgroundColor: "#e4e4e4",
  fontWeight: "bold",
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
