import React, { useState, useEffect } from "react";
import styles from "../Houtai.module.css"; // 引入CSS模块
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/router/api";
interface QuestionResponse {
  question: string;
  answers: string;
}
export interface FAQData {
  question: string;
  answers: string;
  isEditing: boolean;
  id?: number;
}

export default function FAQPage() {
  const [faqData, setFaqData] = useState<FAQData[]>([]); // 本地状态保存问题列表
  const [editableData, setEditableData] = useState<FAQData | null>(null); // 本地状态保存当前编辑的数据

  // 添加功能
  const handleAdd = () => {
    setFaqData((prev) => [
      ...prev,
      { question: "", answers: "", isEditing: true },
    ]);
  };

  // 编辑功能
  const handleEdit = (index: number) => {
    const item = faqData[index];
    setEditableData(item);
    setFaqData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isEditing: true } : item))
    );
  };

  // 保存功能
  const handleSave = async (
    index: number,
    updatedQuestion: string,
    updatedAnswer: string
  ) => {
    try {
      const item = faqData[index];
      if (!item.id) {
        // 新问题
        await createQuestion(updatedQuestion, updatedAnswer);
        setFaqData((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  question: updatedQuestion,
                  answers: updatedAnswer,
                  isEditing: false,
                }
              : item
          )
        );
      } else {
        // 更新问题
        await updateQuestion(
          editableData.question,
          updatedQuestion,
          updatedAnswer
        );
        setFaqData((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  question: updatedQuestion,
                  answers: updatedAnswer,
                  isEditing: false,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to save question", error);
    }
    setEditableData(null);
  };

  // 删除功能
  const handleDelete = async (index: number) => {
    try {
      const item = faqData[index];
      await deleteQuestion(item.question);
      setFaqData((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };

  // 问题列表
  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await getQuestions();
      //console.log("问题列表访问成功");
      setFaqData(
        fetchedQuestions.map((q: QuestionResponse[], index: number) => ({
          ...q,
          id: index + 1,
          isEditing: false,
        }))
      );
    } catch (error) {
      alert("问题列表访问失败");
      console.error("Failed to fetch questions", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <div className={styles.faqContainer}>
        <h2 className="mb-4 text-lg font-semibold !block !text-black !opacity-100">
          FAQ（更新问题时不能只改答案）
        </h2>
        <button onClick={handleAdd} className={styles.faqButton}>
          添加问题
        </button>
        {faqData.map((item, index) =>
          item.isEditing ? (
            <div key={item.id || index} className={styles.faqItem}>
              <div>
                <label>问题: </label>
                <input
                  type="text"
                  value={item.question}
                  className="p-1 mr-2 border"
                  onChange={(e) => {
                    const updatedQuestion = e.target.value;
                    setFaqData((prev) =>
                      prev.map((q, i) =>
                        i === index ? { ...q, question: updatedQuestion } : q
                      )
                    );
                  }}
                />
              </div>
              <div>
                <label>回答: </label>
                <input
                  type="text"
                  value={item.answers}
                  className="p-1 mr-2 border"
                  onChange={(e) => {
                    const updatedAnswer = e.target.value;
                    setFaqData((prev) =>
                      prev.map((q, i) =>
                        i === index ? { ...q, answers: updatedAnswer } : q
                      )
                    );
                  }}
                />
              </div>
              <button
                onClick={() => handleSave(index, item.question, item.answers)}
                className={styles.faqButton}
              >
                保存
              </button>
            </div>
          ) : (
            <div key={item.id || index} className={styles.faqItem}>
              <p className={styles.faqText}>问题: {item.question}</p>
              <p className={styles.faqText}>回答: {item.answers}</p>
              <button
                onClick={() => handleEdit(index)}
                className={styles.faqButton}
              >
                更新问题
              </button>
              <button
                onClick={() => handleDelete(index)}
                className={styles.faqButton}
              >
                删除
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
