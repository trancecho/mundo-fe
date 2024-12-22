import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./App.module.css";

interface Feedback {
  id: number;
  content: string;
  date: string; // 日期字符串，例如：2024-12-21
}

const FeedbackList: React.FC<{ feedbacks: Feedback[] }> = ({ feedbacks }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const handleFeedbackClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleCloseDetails = () => {
    setSelectedFeedback(null);
  };

  return (
    <div>
      {/* 反馈列表 */}
      <div className={styles.table}>
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className={styles.tableRow}
            onClick={() => handleFeedbackClick(feedback)}
          >
            {feedback.content} - {feedback.date}
          </div>
        ))}
      </div>

      {/* 反馈详情弹窗 */}
      {selectedFeedback && (
        <div className={styles.feedbackDetails}>
          <div className={styles.detailsContent}>
            <h3>反馈详情</h3>
            <p>{selectedFeedback.content}</p>
            <p>提交时间：{selectedFeedback.date}</p>
            <button className={styles.closeButton} onClick={handleCloseDetails}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  // 请求接口获取数据
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const config = {
        method: "get",
        url: "http://127.0.0.1:12349/api/feedback/admissionread?service=mundo",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6IuS5neaAnSIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiVGltZXJNZTMiLCJleHAiOjE3MzQ4NzkwNzksImlhdCI6MTczNDI3NDI3OX0.vtpv6Lf-usTvUu6JJHxGZhgSh9MnPNAQs-wOtkyMrlc",
        },
      };

      try {
        const response = await axios(config);
        setFeedbacks(response.data); // 假设接口返回的数据符合 Feedback 类型
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  // 排序功能
  const sortFeedbacks = () => {
    const sorted = [...feedbacks].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setFeedbacks(sorted);
    setIsAscending(!isAscending);
  };

  return (
    <div className={styles.content}>
      <div className={styles.contentHeader}>
        <span className={styles.sort} onClick={sortFeedbacks}>
          时间{isAscending ? "↑" : "↓"}
        </span>
      </div>
      <hr className={styles.line} />

      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
};

export default FeedbackPage;

