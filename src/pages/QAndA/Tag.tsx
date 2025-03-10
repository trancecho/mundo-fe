import React from 'react';
import './QAndA.css';

// Tag组件，用于展示一个带有文本的标签
interface TagProps {
    text: string; // 标签显示的文本内容
    className?: string; // 可选的自定义类名，用于添加额外的样式
}

export const Tag: React.FC<TagProps> = ({ text, className }) => {
    return (
        <div className={`tag ${className? className : ''}`}>
            {text}
        </div>
    );
};
