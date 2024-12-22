import React, { useState, useEffect } from 'react';
import styles from './review.module.css';

interface PostProps {
  postData: {
    id: number;
    title: string;
    description: string;
    tags?: { id: number; name: string }[];
    photos?: string[];
  };
}

const Post: React.FC<PostProps> = ({ postData }) => {
  const [comment, setComment] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending'); // 审核状态
  const [loading, setLoading] = useState(false);

  // 模拟从后端获取审核状态
  useEffect(() => {
    // 模拟后端请求
    setLoading(true);
    setTimeout(() => {
      // 模拟获取状态：假设初始状态是 "pending"
      setApprovalStatus('pending');
      setLoading(false);
    }, 1000); // 模拟 1 秒延迟
  }, [postData.id]);

  const handleApprove = async (id: number) => {
    setLoading(true);
    console.log(`审核通过: Post ID ${id}`, { comment });
    setTimeout(() => {
      setApprovalStatus('approved'); // 模拟后端返回审核通过
      alert(`审核通过：Post ID ${id}`);
      setLoading(false);
    }, 1000); // 模拟后端延迟
  };

  const handleReject = async (id: number) => {
    setLoading(true);
    console.log(`审核拒绝: Post ID ${id}`, { comment });
    setTimeout(() => {
      setApprovalStatus('rejected'); // 模拟后端返回审核拒绝
      alert(`审核拒绝：Post ID ${id}`);
      setLoading(false);
    }, 1000); // 模拟后端延迟
  };

  return (
    <div className={styles.postContainer}>
      {loading && <p>加载中...</p>}

      {!loading && (
        <>
          <div className={styles.postMessage}>
            <h3 className={styles.title}>{postData.title}</h3>
            <p className={styles.description}>{postData.description}</p>
          </div>

          {postData.tags && (
            <div className={styles.tags}>
              {postData.tags.map((tag) => (
                <span className={styles.tag} key={tag.id}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className={styles.reviewActions}>
            {approvalStatus === 'pending' ? (
              <div className={styles.buttonGroup}>
                <button
                  className={styles.approveButton}
                  onClick={() => handleApprove(postData.id)}
                >
                  ✔️ 
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleReject(postData.id)}
                >
                  ❌ 
                </button>
              </div>
            ) : approvalStatus === 'approved' ? (
              <p className={styles.approvedMessage}>✅ </p>
            ) : (
              <p className={styles.rejectedMessage}>❌ </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Post;




