import { useState, useEffect } from 'react';


interface ItemProps {
  item: {
    id: number;
    title: string;
    downloadLink: string;
    hotness: number;
    date: string;
  };
}

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <div
      style={{
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#fff",
        color: "#000", // 所有文字显示为黑色
      }}
    >
      <h3>{item.title}</h3>
      <p><strong>下载链接:</strong> <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">点击下载</a></p>
      <p><strong>热度:</strong> {item.hotness}</p>
      <p><strong>日期:</strong> {item.date}</p>
    </div>
  );
};

export default Item;
