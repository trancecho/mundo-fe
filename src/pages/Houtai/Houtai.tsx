import React, { useState } from 'react';
import styles from './Houtai.module.css'; // 引入CSS模块

const menuItems = [
  { key: 'home', label: '首页' },
  { key: 'feedback', label: '用户反馈' },
  { key: 'faq', label: 'FAQ设置' },
  { key: 'review', label: '审核' }
];

const Houtai: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('home'); // 当前选中菜单
  const [faqData, setFaqData] = useState([
    { id: 1, question: '问题1', answer: '回答1', isEditing: false },
    { id: 2, question: '问题2', answer: '回答2', isEditing: false }
  ]);

  // 编辑功能
  const handleEdit = (id: number) => {
    setFaqData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEditing: true } : item))
    );
  };

  // 保存功能
  const handleSave = (id: number, updatedQuestion: string, updatedAnswer: string) => {
    setFaqData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, question: updatedQuestion, answer: updatedAnswer, isEditing: false } : item
      )
    );
  };

  return (
    <div className="relative bg-gray-100 h-screen">
      {/* 顶部区域 */}
      <div className={styles.header}>MUNDO后台</div>

      {/* 左侧导航栏 */}
      <div className={styles.sidebar}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`${styles.menuItem} ${
              selectedMenu === item.key ? styles.active : ''
            }`}
            onClick={() => setSelectedMenu(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* 右侧 FAQ 区域 */}
      {selectedMenu === 'faq' && (
        <div className={styles.faqContainer}>
          <h2 className="text-lg font-semibold mb-4">FAQ</h2>
          {faqData.map((item) =>
            item.isEditing ? (
              <div key={item.id} className={styles.faqItem}>
                <div>
                  <label>问题: </label>
                  <input
                    type="text"
                    defaultValue={item.question}
                    className="border p-1 mr-2"
                    onChange={(e) => (item.question = e.target.value)}
                  />
                </div>
                <div>
                  <label>回答: </label>
                  <input
                    type="text"
                    defaultValue={item.answer}
                    className="border p-1 mr-2"
                    onChange={(e) => (item.answer = e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleSave(item.id, item.question, item.answer)}
                  className={styles.faqButton}
                >
                  保存
                </button>
              </div>
            ) : (
              <div key={item.id} className={styles.faqItem}>
                <p className={styles.faqText}>问题: {item.question}</p>
                <p className={styles.faqText}>回答: {item.answer}</p>
                <button onClick={() => handleEdit(item.id)} className={styles.faqButton}>
                  编辑
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Houtai;
