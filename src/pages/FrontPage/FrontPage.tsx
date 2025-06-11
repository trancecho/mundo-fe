import React from 'react'
import { Link } from 'react-router-dom'
import styles from './FrontPage.module.css'

const FrontPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoText}>MUNDO</span>
          </div>
          <nav className={styles.nav}>
            <Link to='/login' className={styles.navLink}>
              登录
            </Link>
            <Link to='/register' className={styles.navLink}>
              注册
            </Link>
            <Link to='/qanda' className={styles.navLink}>
              探索
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleGradient}>MUNDO</span>
            <div className={styles.titleShadow} aria-hidden='true'>
              MUNDO
            </div>
          </h1>
          <p className={styles.heroSubtitle}>
            未央学社打造的全方位的大学生学习社区
            <br />
            知识分享 · 资源互助 · 高效学习
          </p>

          <div className={styles.heroActions}>
            <Link to='/register' className={styles.heroCta}>
              立即加入
            </Link>
            <Link to='/qanda' className={styles.heroSecondaryCta}>
              开始探索 →
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>活跃用户</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5K+</div>
              <div className={styles.statLabel}>问题解答</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1K+</div>
              <div className={styles.statLabel}>学习小组</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100+</div>
              <div className={styles.statLabel}>精品资料</div>
            </div>
          </div>
        </div>
        {/* <div className={styles.heroGradient}></div> */}
      </section>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>全方位学习助手</h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💡</div>
              <h3>在线答疑</h3>
              <p>专业课程疑难解答，快速获得高质量解答，突破学习难点</p>
              <Link to='/qanda' className={styles.featureLink}>
                立即提问 →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌐</div>
              <h3>学习论坛</h3>
              <p>分享学习经验，讨论热门话题，建立知识社区</p>
              <Link to='/forum' className={styles.featureLink}>
                加入讨论 →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3>组队学习</h3>
              <p>找到志同道合的学习伙伴，组建高效学习小组，共同进步</p>
              <Link to='/teamup' className={styles.featureLink}>
                寻找伙伴 →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>资料共享</h3>
              <p>海量优质学习资源，包含往年试题、笔记、实验报告等</p>
              <Link to='/datastation' className={styles.featureLink}>
                浏览资料 →
              </Link>
            </div>

            {/* <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏱️</div>
              <h3>TimerMe</h3>
              <p>科学的时间管理工具，提高学习效率，养成良好习惯</p>
              <Link to="/timerme" className={styles.featureLink}>开始计时 →</Link>
            </div> */}
          </div>
        </section>

        <section className={`${styles.section} ${styles.dynamicSection}`}>
          <div className={styles.dynamicContent}>
            <div className={styles.dynamicText}>
              <h2>智慧学习新体验</h2>
              <p className='text-[1rem]'>
                突破传统学习方式的局限，打造全新的互助学习生态系统
                <br />
                <span className={styles.highlight}>
                  答疑解惑快速响应，平均解答时间不超过30分钟
                </span>
              </p>
              <div className={styles.techStack}>
                <span>实时答疑</span>
                <span>资源共享</span>
                <span>学习社区</span>
                <span>组队协作</span>
                {/* <span>时间管理</span> */}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>学习之旅从这里开始</h2>
          <div className={styles.ctaSection}>
            <div className={styles.ctaText}>
              <p>加入MUNDO，与数万名大学生一起，开启你的高效学习之旅</p>
            </div>
            <Link to='/register' className={styles.ctaButton}>
              立即注册
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>MUNDO</div>
              <p>让大学学习更简单、更高效、更有趣</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.linkGroup}>
                <h4>核心功能</h4>
                <Link to='/qanda'>在线答疑</Link>
                <Link to='/forum'>学习论坛</Link>
                <Link to='/teamup'>组队学习</Link>
                <Link to='/datastation'>资料站</Link>
              </div>
              <div className={styles.linkGroup}>
                <h4>快速入口</h4>
                <Link to='/login'>登录</Link>
                <Link to='/register'>注册</Link>
              </div>
            </div>
          </div>

          {/* 新增备案信息区块 */}
          <div className={styles.footerRecord}>
            <div className={styles.recordContent}>
              <span>©2025 未央学社 MUNDO</span>
              <a
                href='https://beian.miit.gov.cn'
                target='_blank'
                rel='noopener noreferrer'
              >
                浙ICP备2024090241号-2
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default FrontPage
