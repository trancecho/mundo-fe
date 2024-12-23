import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";

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
  const [selectedTab, setSelectedTab] = useState<string>(activeTab);
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
      queries = ["其他"];
    }

    // 发送多个请求
    Promise.all(
      queries.map((name) =>
        axios.get(`http://127.0.0.1:4523/m1/4936698-4594190-default/api/files?name=${name}`)
      )
    )
      .then((responses) => {
        const fetchedItems = responses.flatMap((response) => response.data.data.files); // 合并所有响应的数据
        setItems(fetchedItems); // 更新 items 状态
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("获取资料失败，请稍后再试");
        setLoading(false);
      });
  }, [activeCategory, selectedTab]);

  useEffect(() => {
    if (selectedTab === "hot") {
      setItems((prevItems) => prevItems.sort((a, b) => b.hotness - a.hotness));
    } else if (selectedTab === "new") {
      setItems((prevItems) =>
        prevItems.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );
    }
  }, [selectedTab]);

  useEffect(() => {
    console.log('Fetched items:', items);  // 查看 items 数据
  }, [items]);
  

  const handleSort = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleDownload = (item: ItemData) => {
    console.log('Downloading item:', item);  // 确保点击事件触发
    axios
      .post("http://127.0.0.1:4523/m1/4936698-4594190-default/api/cloud_disk/download", {
        name: item.name,
        folder_id: item.folder_id,
      })
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
        width: "75%",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 添加阴影
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
  marginRight: "10px",
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
