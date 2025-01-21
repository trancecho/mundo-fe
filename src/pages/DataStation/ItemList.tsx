import React, { useEffect, useState } from "react";
import Item from "./Item";
import { getFileList, downloadFile } from "@/router/api";

interface ItemListProps {
  activeCategory: string;
  activeTab: string;
}

interface ItemData {
  id: number;
  name: string; // 文件名
  updated_at: string; // 更新时间
  folder_id: number; // 文件夹 ID
  hotness: number;
  size: number;
  url: string; // 下载链接
}

const ItemList: React.FC<ItemListProps> = ({ activeCategory, activeTab }) => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("hot");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let queries: string[] = [];

    // 根据 activeCategory 动态设置要查询的 name 值
    if (activeCategory === "高数") {
      queries = ["高数上", "高数下"];
    } else if (activeCategory === "大物") {
      queries = ["大物上", "大物下"];
    } else if (activeCategory === "C语言") {
      queries = ["C语言"];
    } else if (activeCategory === "其他") {
      queries = ["其它"];
    }

    const token = localStorage.getItem('token');
    console.log('Token:', token);

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
        setError("获取资料失败，请稍后再试");
        setLoading(false);
      });
  }, [activeCategory]);

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
    console.log('Fetched items:', items);  // 查看 items 数据
  }, [items]);


  const handleSort = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleDownload = (item: ItemData) => {
    console.log('Downloading item:', item);  // 确保点击事件触发
    downloadFile(item)
      .then((response) => {
        console.log('Download response:', response.data);  // 查看响应数据
        if (response.data.message === "下载结果") {
          const newItems = items.map((i) =>
            i.id === item.id ? { ...i, url: response.data.data.url } : i
          );
          setItems(newItems); // 更新 items 状态
          console.log('Updated items:', newItems);  // 确保 items 更新了
        } else {
          alert("今日请求次数超过限制");
        }
      })
      .catch((error) => {
        console.error("下载请求失败:", error);
        alert("下载失败，请稍后再试");
      });
  };

  if (loading) return <p>加载中....</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        width: "100%",
        padding: "50px",
        boxShadow: "5px 15px 8px rgba(0, 0, 0, 0.2)", // 添加阴影
        borderRadius: "5px",
        color: "#000", // 所有文字显示为黑色
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleSort("hot")}
          style={selectedTab === "hot" ? { ...activeTabStyle, boxShadow: "0 4px 8px rgb(16, 124, 248)" } : tabStyle}
        >
          最热
        </button>
        <button
          onClick={() => handleSort("new")}
          style={selectedTab === "new" ? { ...activeTabStyle, boxShadow: "0 4px 8px rgb(16, 124, 248)" } : tabStyle}
        >
          最新
        </button>
      </div>
      {items.length === 0 ? <p>没有资料</p> : items.map(item => <Item key={item.id} item={item} onDownload={handleDownload} />)}
    </div>
  );
};

const tabStyle: React.CSSProperties = {
  marginRight: "1px",
  padding: "10px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: "5px",
  backgroundColor: "#f4f4f4",
  color: "#000", // 文字颜色为黑色
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  backgroundColor: "#e4e4e4",
  fontWeight: "bold",
};

export default ItemList;
