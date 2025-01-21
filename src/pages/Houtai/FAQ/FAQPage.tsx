import React, { Component , useState } from 'react'
import styles from '../Houtai.module.css'; // 引入CSS模块


export default function FAQPage() {
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
    <div>
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
    </div>
  )
}

