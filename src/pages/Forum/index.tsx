import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import styles from './forum.module.css';

interface Post {
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
  replies: number;
  created_at: string;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // 模拟标签数据
  const tags = ['全部', '学习', '竞赛', '项目', '求助', '讨论'];

  // 模拟帖子数据
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: '求助：如何准备数学建模比赛？',
        content: '大家好，我想请教一下如何准备数学建模比赛...',
        author: { id: 1, username: '学习达人', avatar: '' },
        tags: ['竞赛', '求助'],
        likes: 15,
        replies: 8,
        created_at: '2024-03-15'
      },
      // 添加更多模拟帖子...
    ];
    setPosts(mockPosts);
  }, []);

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <div className={styles.tagContainer}>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagButton} ${selectedTag === tag ? styles.tagActive : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className={styles.createPost}>
          <button className={styles.createButton}>发布新帖子</button>
        </div>

        <div className={styles.postList}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <img src={post.author.avatar || '/default-avatar.png'} alt="avatar" className={styles.avatar} />
                <span className={styles.username}>{post.author.username}</span>
                <span className={styles.date}>{post.created_at}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postContent}>{post.content}</p>
              <div className={styles.postTags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.postFooter}>
                <span className={styles.likes}>👍 {post.likes}</span>
                <span className={styles.replies}>💬 {post.replies}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
