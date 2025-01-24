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
            height: "40vh",
            backgroundColor: "#fff",
            paddingTop: "20px",
            paddingRight: "20px",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            marginRight: "20px",
            color: "#000",
        }}>
            {categories.map(({ path, label }) => (
                <div
                    key={path}
                    onClick={() => navigate(`/datastation/${path}`)}
                    style={{
                        ...itemStyle,
                        color: currentPath === path ? "#000" : "#888"
                    }}
                >
                    {label}
                </div>
            ))}
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
