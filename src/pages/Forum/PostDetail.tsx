import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/ui/Header/Header';
import { Input } from '@/components/ui/input';
import styles from './forum.module.css';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  created_at: string;
  likes: number;
}

interface PostDetail {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  tags: string[];
  likes: number;
  comments: Comment[];
  created_at: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取帖子详情数据
    const mockPost: PostDetail = {
      id: 1,
      title: '求助：如何准备数学建模比赛？',
      content: '大家好，我想请教一下如何准备数学建模比赛。我是大二学生，想参加明年的数模比赛，但不知道从何开始准备。希望有经验的同学能给些建议！',
      author: { id: 1, username: '学习达人', avatar: '' },
      tags: ['竞赛', '求助'],
      likes: 15,
      comments: [
        {
          id: 1,
          content: '建议先学习Python和MATLAB，这两个工具在建模中很重要。',
          author: { id: 2, username: '数模达人', avatar: '' },
          created_at: '2024-03-15 14:30',
          likes: 5
        }
      ],
      created_at: '2024-03-15 10:00'
    };
    
    setTimeout(() => {
      setPost(mockPost);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      content: newComment,
      author: { id: 999, username: '当前用户', avatar: '' },
      created_at: new Date().toISOString(),
      likes: 0
    };

    setPost(prev => prev ? {
      ...prev,
      comments: [...prev.comments, comment]
    } : null);

    setNewComment('');
  };

  if (loading) return <div className={styles.loading}>加载中...</div>;
  if (!post) return <div className={styles.error}>帖子不存在</div>;

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <div className={styles.postDetailCard}>
          <div className={styles.postHeader}>
            <img src={post.author.avatar || '/default-avatar.png'} alt="avatar" className={styles.avatar} />
            <span className={styles.username}>{post.author.username}</span>
            <span className={styles.date}>{post.created_at}</span>
          </div>
          
          <h1 className={styles.postDetailTitle}>{post.title}</h1>
          <p className={styles.postDetailContent}>{post.content}</p>
          
          <div className={styles.postTags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          
          <div className={styles.postActions}>
            <button className={styles.likeButton}>👍 {post.likes}</button>
            <button className={styles.shareButton}>分享</button>
          </div>

          <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>评论 ({post.comments.length})</h3>
            
            <div className={styles.commentInput}>
              <Input
                placeholder="写下你的评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.input}
              />
              <button 
                className={styles.submitButton}
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                发表评论
              </button>
            </div>

            <div className={styles.commentsList}>
              {post.comments.map((comment) => (
                <div key={comment.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <img src={comment.author.avatar || '/default-avatar.png'} alt="avatar" className={styles.commentAvatar} />
                    <span className={styles.commentUsername}>{comment.author.username}</span>
                    <span className={styles.commentDate}>{comment.created_at}</span>
                  </div>
                  <p className={styles.commentContent}>{comment.content}</p>
                  <div className={styles.commentActions}>
                    <button className={styles.commentLike}>👍 {comment.likes}</button>
                    <button className={styles.commentReply}>回复</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;