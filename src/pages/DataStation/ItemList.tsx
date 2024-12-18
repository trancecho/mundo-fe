import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchedItems: ItemData[] = [
      { id: 1, title: "高数资料A", downloadLink: "#", hotness: 120, date: "2024-12-01", category: "高数" },
      { id: 2, title: "大物资料B", downloadLink: "#", hotness: 150, date: "2024-12-02", category: "大物" },
      { id: 3, title: "C语言资料C", downloadLink: "#", hotness: 100, date: "2024-12-03", category: "C语言" },
      { id: 4, title: "其他资料D", downloadLink: "#", hotness: 200, date: "2024-12-04", category: "其他" },
      { id: 5, title: "高数资料E", downloadLink: "#", hotness: 90, date: "2024-12-05", category: "高数" },
    ];

    // 根据分类过滤数据
    const filteredItems = fetchedItems.filter(item => item.category === activeCategory);

    // 根据排序方式进行排序
    const sortedItems =
      selectedTab === "hot"
        ? filteredItems.sort((a, b) => b.hotness - a.hotness)
        : filteredItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setItems(sortedItems);
  }, [activeCategory, selectedTab]);

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
          onClick={() => setSelectedTab("hot")}
          style={selectedTab === "hot" ? { ...activeTabStyle, boxShadow: "0 4px 8px rgb(16, 124, 248)" } : tabStyle}
        >
          最热
        </button>
        <button
          onClick={() => setSelectedTab("new")}
          style={selectedTab === "new" ? { ...activeTabStyle, boxShadow: "0 4px 8px rgb(16, 124, 248)" } : tabStyle}
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
