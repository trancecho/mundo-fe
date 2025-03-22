import React from 'react';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  // 模拟用户数据，实际应用中应从后端获取
  const userData = {
    username: '梦渡幻响',
    avatar: 'https://avatars.githubusercontent.com/u/12345678',
    bio: '探索未知的边界，连接无限的可能',
    stats: {
      posts: 128,
      answers: 356,
      likes: 2890,
      teams: 15
    },
    badges: [
      { id: 1, name: '知识达人', icon: '🎓' },
      { id: 2, name: '优质答主', icon: '⭐' },
      { id: 3, name: '团队先锋', icon: '🚀' }
    ]
  };

  return (
    <div className={styles.container}>
      {/* 个人信息卡片 */}
      <section className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <img src={userData.avatar} alt="用户头像" className={styles.avatar} />
            <div className={styles.avatarGlow}></div>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.username}>{userData.username}</h1>
            <p className={styles.bio}>{userData.bio}</p>
            <div className={styles.badges}>
              {userData.badges.map(badge => (
                <span key={badge.id} className={styles.badge}>
                  {badge.icon} {badge.name}
                </span>
              ))}
            </div>
          </div>
          <button className={styles.editButton}>编辑资料</button>
        </div>
      </section>

      {/* 数据统计 */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userData.stats.posts}</div>
            <div className={styles.statLabel}>发布文章</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userData.stats.answers}</div>
            <div className={styles.statLabel}>问题解答</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userData.stats.likes}</div>
            <div className={styles.statLabel}>获得点赞</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userData.stats.teams}</div>
            <div className={styles.statLabel}>参与团队</div>
          </div>
        </div>
      </section>

      {/* 内容管理 */}
      <section className={styles.contentSection}>
        <div className={styles.contentHeader}>
          <h2>我的内容</h2>
          <div className={styles.contentNav}>
            <button className={`${styles.navButton} ${styles.active}`}>文章</button>
            <button className={styles.navButton}>回答</button>
            <button className={styles.navButton}>团队</button>
          </div>
        </div>
        <div className={styles.contentGrid}>
          {/* 示例内容卡片 */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>技术探讨</span>
              <span className={styles.cardDate}>2024-03-15</span>
            </div>
            <h3 className={styles.cardTitle}>量子计算在机器学习中的应用前景</h3>
            <p className={styles.cardExcerpt}>
              探讨量子计算如何revolutionize传统机器学习模型的训练过程...
            </p>
            <div className={styles.cardFooter}>
              <div className={styles.cardStats}>
                <span>👁️ 1.2k</span>
                <span>💬 48</span>
                <span>❤️ 238</span>
              </div>
              <Link to="/article/1" className={styles.readMore}>阅读全文</Link>
            </div>
          </div>
          {/* 可以添加更多内容卡片 */}
        </div>
      </section>
    </div>
  );
};

export default Profile;