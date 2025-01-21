import React from 'react';
import { FaHeadset } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
//导入button组件和客服图标

interface CustomerServiceButtonProps {
    onClick: () => void;
}//设定点击事件，用于之后决定answerwindow的显示和隐藏

const CustomerServiceButton: React.FC<CustomerServiceButtonProps> = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                background: '#3085F3',
                borderRadius: '50%',
                color: 'white',
                border: 'none',
                padding: '10px',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease', // 鼠标悬停时的动画
                zIndex: 41, // 确保客服按钮位于上层
            }}
            onMouseEnter={(e) => {
                // 鼠标悬停时放大按钮
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                // 鼠标离开时恢复按钮大小
                e.currentTarget.style.transform = 'scale(1)';
            }}
            onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #007bff'; // 自定义聚焦样式
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = 'none'; // 失去焦点时去除聚焦样式
            }}
        >
            <FaHeadset size={20} />
        </Button>

    );
};

export default CustomerServiceButton;
