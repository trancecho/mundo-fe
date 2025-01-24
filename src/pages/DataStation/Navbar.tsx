import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();

    const categories = [
        { path: 'math', label: '高数' },
        { path: 'physics', label: '大物' },
        { path: 'c-language', label: 'C语言' },
        { path: 'others', label: '其他' }
    ];

    return (
        <div style={{
            width: "150px",
            backgroundColor: "#fff",
            padding: "20px 20px 20px 20px",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            marginRight: "20px",
            marginLeft: "50px",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
        }}>
            {categories.map(({ path, label }) => (
                <div
                    key={path}
                    className="nav-item"
                    onClick={() => navigate(`/datastation/${path}`)}
                    style={{
                        ...itemStyle,
                        backgroundColor: currentPath === path ? "#1890ff" : "transparent",
                        color: currentPath === path ? "#fff" : "#000"
                    }}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};

const itemStyle: React.CSSProperties = {
    padding: "13px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    transition: "all 0.3s ease",
    borderRadius: "4px",
    margin: "5px 0",
};

// 修改 CSS 样式表
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .nav-item {
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
        text-align: center;
        transition: all 0.3s ease !important;
        border-radius: 4px;
        margin: 5px 0;
    }
    
    .nav-item:hover:not([style*="background-color: rgb(24, 144, 255)"]) {
        background-color: #00a6ffa5 !important;
    }
`;
document.head.appendChild(styleSheet);

export default Navbar;
