import React from "react";

interface NavbarProps {
  setActiveCategory: (category: string) => void;
  activeCategory: string; // 接收当前选中的分类
}

const Navbar: React.FC<NavbarProps> = ({ setActiveCategory, activeCategory }) => {
  return (
    <div
      style={{
        width: "150px",
        height: "40vh", // 设置高度为视口的一半
        backgroundColor: "#fff",
        paddingTop: "20px",
        paddingRight: "20px",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.2)", // 添加阴影
        borderRadius: "5px",
        marginRight: "20px",
        color: "#000", // 所有文字显示为黑色
      }}
    >
      <div
        onClick={() => setActiveCategory("高数")}
        style={{ ...itemStyle, color: activeCategory === "高数" ? "#000" : "#888" }}
      >
        高数
      </div>
      <div
        onClick={() => setActiveCategory("大物")}
        style={{ ...itemStyle, color: activeCategory === "大物" ? "#000" : "#888" }}
      >
        大物
      </div>
      <div
        onClick={() => setActiveCategory("C语言")}
        style={{ ...itemStyle, color: activeCategory === "C语言" ? "#000" : "#888" }}
      >
        C语言
      </div>
      <div
        onClick={() => setActiveCategory("其他")}
        style={{ ...itemStyle, color: activeCategory === "其他" ? "#000" : "#888" }}
      >
        其他
      </div>
    </div>
  );
};

const itemStyle: React.CSSProperties = {
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
};

export default Navbar;
