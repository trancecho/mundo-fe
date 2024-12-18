import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";

interface ItemListProps {
  activeCategory: string;
  activeTab: string;
}

interface ItemData {
  id: number;
  title: string;
  downloadLink: string;
  hotness: number;
  date: string;
  category: string; // 增加分类字段
}

const ItemList: React.FC<ItemListProps> = ({ activeCategory, activeTab }) => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>(activeTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // 请求后端获取资料数据
    setLoading(true);
    setError(null);

    axios
      .get(`http://your-backend-api.com/items?category=${activeCategory}`)
      .then((response) => {
        setItems(response.data); // 设置响应数据到状态
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("获取资料失败，请稍后再试");
        setLoading(false);
      });
  }, [activeCategory, selectedTab]);

  //在前端排序
  useEffect(() => {
    if (selectedTab === "hot") {
      // 热度排序
      setItems((prevItems) =>
        prevItems.sort((a, b) => b.hotness - a.hotness)
      );
    } else if (selectedTab === "new") {
      // 日期排序
      setItems((prevItems) =>
        prevItems.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    }
  }, [selectedTab]); // Runs every time selectedTab changes

  const handleSort = (tab: string) => {
    setSelectedTab(tab);
  };

  if (loading) return <p>加载中....</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 添加阴影
        borderRadius: "5px",
        color: "#000", // 所有文字显示为黑色
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleSort("hot")}
          style={
            selectedTab === "hot"
              ? { ...activeTabStyle, boxShadow: "0 4px 8px rgb(16, 124, 248)" }
              : tabStyle
          }
        >
          最热
        </button>
        <button
          onClick={() => handleSort("new")}
          style={
            selectedTab === "new"
              ? { ...activeTabStyle, boxShadow: "0 4px 8px rgb(16, 124, 248)" }
              : tabStyle
          }
        >
          最新
        </button>
      </div>
      {items.length === 0 ? <p>没有资料</p> : items.map(item => <Item key={item.id} item={item} />)}
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
