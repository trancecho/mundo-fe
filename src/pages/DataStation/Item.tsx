import React from "react";

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
      <h3>{item.name}</h3>  {/* 文件名 */}
      <p><strong>文件大小:</strong> {sizeInMB} MB</p>  {/* 文件大小 */}
      
      {/* 如果有下载链接则显示链接，否则显示按钮 */}
      <p><strong>下载链接: </strong> 
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" > 点击下载</a>
        ) : (
          <button  style={downloadButtonStyle} onClick={() => onDownload(item) }>点击下载</button>
        )}
      </p>
      
      <p><strong>热度:</strong> {item.hotness}</p>
       
      <p><strong>更新时间:</strong> {formatDate(item.updated_at)}</p>
    </div>
  );
};

const downloadButtonStyle: React.CSSProperties = {
  backgroundColor: "hsl(212, 100.00%, 50.00%)", // 背景色
  color: "#fff", // 白色文字
  padding: "7px 13px", // 适当的内边距
  border: "none", // 去掉边框
  borderRadius: "15px", // 圆角
  cursor: "pointer", // 鼠标变成点击手型
  fontSize: "16px", // 字体大小
  boxShadow: "0 4px 8px hsl(0, 3.00%, 32.70%)", // 阴影效果
};

export default Item;
