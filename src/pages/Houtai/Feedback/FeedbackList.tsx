import React, { useState } from "react";
import styles from "../App.module.css";

interface Feedback {
  id: number;
  content: string;
  date: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
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

export default FeedbackList;
