import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FrontPage.module.css';

const FrontPage: React.FC = () => {
  return (
      <div className={styles.container}>
        {/* 固定导航栏 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <span className={styles.logoText}>MUNDO</span>
            </div>
            <nav className={styles.nav}>
              <Link to="/login" className={styles.navLink}>登录</Link>
              <Link to="/register" className={styles.navLink}>注册</Link>
              <Link to="/qanda" className={styles.navLink}>探索</Link>
            </nav>
          </div>
        </header>

        {/* 首屏Hero部分 */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleGradient}>MUNDO</span>
              <div className={styles.titleShadow} aria-hidden="true">MUNDO</div>
            </h1>
            <p className={styles.heroSubtitle}>连接全球求知者 · 构建智慧共同体</p>

            <div className={styles.heroActions}>
              <Link to="/register" className={styles.heroCta}>立即加入</Link>
              <Link to="/qanda" className={styles.heroSecondaryCta}>先行探索 →</Link>
            </div>

            {/* 动态统计数字 */}
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>850K+</div>
                <div className={styles.statLabel}>活跃用户</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>2.1M+</div>
                <div className={styles.statLabel}>优质内容</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>150+</div>
                <div className={styles.statLabel}>学科领域</div>
              </div>
            </div>
          </div>

          {/* 装饰性渐变背景 */}
          <div className={styles.heroGradient}></div>
        </section>

        {/* 主内容区 */}
        <main className={styles.mainContent}>
          {/* 核心功能模块 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>为什么选择 MUNDO？</h2>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🧠</div>
                <h3>智能知识图谱</h3>
                <p>通过AI构建的知识网络，精准连接问题与解决方案</p>
                <div className={styles.featureHoverEffect}></div>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🚀</div>
                <h3>实时协作空间</h3>
                <p>支持多人协同编辑、代码沙箱和虚拟白板</p>
                <div className={styles.featureHoverEffect}></div>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🌐</div>
                <h3>全球学习网络</h3>
                <p>连接190+国家/地区的学者和实务专家</p>
                <div className={styles.featureHoverEffect}></div>
              </div>
            </div>
          </section>

          {/* 动态展示区 */}
          <section className={`${styles.section} ${styles.dynamicSection}`}>
            <div className={styles.dynamicContent}>
              <div className={styles.dynamicText}>
                <h2>知识进化新范式</h2>
                <p>
                  通过我们的量子化知识引擎，实现问题求解效率的指数级提升。
                  <span className={styles.highlight}>平均解决时间缩短67%</span>
                </p>
                <div className={styles.techStack}>
                  <span>AI增强</span>
                  <span>区块链存证</span>
                  <span>量子计算</span>
                </div>
              </div>
              <div className={styles.dynamicVisual}>
                {/* 这里可以添加动态SVG或Canvas */}
                <div className={styles.visualPlaceholder}></div>
              </div>
            </div>
          </section>

          {/* 用户见证模块 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>全球用户见证</h2>
            <div className={styles.testimonials}>
              <div className={styles.testimonialCard}>
                <div className={styles.userMeta}>
                  <div className={styles.userAvatar}>🐧</div>
                  <div>
                    <div className={styles.userName}>开源贡献者</div>
                    <div className={styles.userTitle}>@LinuxDev</div>
                  </div>
                </div>
                <p>"在这里找到了多个开源项目的核心贡献者，协作效率超乎想象！"</p>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.userMeta}>
                  <div className={styles.userAvatar}>👩🔬</div>
                  <div>
                    <div className={styles.userName}>科研团队</div>
                    <div className={styles.userTitle}>@QuantumResearch</div>
                  </div>
                </div>
                <p>"跨学科的深度讨论帮助我们突破了量子计算的关键瓶颈"</p>
              </div>
            </div>
          </section>
        </main>

        {/* 全局页脚 */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerMain}>
              <div className={styles.footerBrand}>
                <div className={styles.logo}>MUNDO</div>
                <p>© 2024 梦渡幻响互联网信息服务工作室</p>
              </div>
              <div className={styles.footerLinks}>
                <div className={styles.linkGroup}>
                  <h4>探索</h4>
                  <Link to="/discover">知识图谱</Link>
                  <Link to="/trending">趋势话题</Link>
                  <Link to="/events">学术活动</Link>
                </div>
                <div className={styles.linkGroup}>
                  <h4>共建</h4>
                  <Link to="/contribute">内容贡献</Link>
                  <Link to="/moderation">社区治理</Link>
                  <Link to="/research">研究合作</Link>
                </div>
                <div className={styles.linkGroup}>
                  <h4>法律</h4>
                  <Link to="/terms">服务条款</Link>
                  <Link to="/privacy">隐私政策</Link>
                  <Link to="/license">知识协议</Link>
                </div>
              </div>
            </div>
            <div className={styles.footerSocial}>
              <button className={styles.socialButton}>𝕏</button>
              <button className={styles.socialButton}>𝔽</button>
              <button className={styles.socialButton}>𝕃</button>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default FrontPage;