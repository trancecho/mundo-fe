import React, { useState } from 'react';
import styles from './article.module.css';
import Header from '@/components/ui/Header/Header';

interface Article {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    tags: string[];
    category: string;
}

const Article: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([
        {
            id: 1,
            title: '深入理解React Hooks的工作原理',
            content: 'React Hooks的出现彻底改变了React组件的编写方式，本文将深入探讨Hooks的实现原理和最佳实践...',
            author: '张三',
            date: '2024-03-20',
            tags: ['React', 'JavaScript', '前端开发'],
            category: '技术教程',
            readTime: '10分钟',
            coverImage: 'https://picsum.photos/800/400'
        },
        {
            id: 2,
            title: '人工智能在教育领域的应用与展望',
            content: '随着人工智能技术的快速发展，其在教育领域的应用也日益广泛。本文将探讨AI如何改变传统教育模式...',
            author: '李四',
            date: '2024-03-19',
            tags: ['人工智能', '教育科技', '创新'],
            category: '前沿科技',
            readTime: '8分钟',
            coverImage: 'https://picsum.photos/800/401'
        },
        {
            id: 3,
            title: '可持续发展：未来城市建设的新方向',
            content: '在全球气候变化的背景下，可持续发展已成为城市建设的核心理念。本文将分析绿色建筑和智慧城市的发展趋势...',
            author: '王五',
            date: '2024-03-18',
            tags: ['可持续发展', '城市规划', '环保'],
            category: '社会发展',
            readTime: '12分钟',
            coverImage: 'https://picsum.photos/800/402'
        }
    ]);
    const [selectedCategory, setSelectedCategory] = useState<string>('全部');
    const categories = ['全部', '技术教程', '前沿科技', '社会发展', '文化艺术'];

    const filteredArticles = selectedCategory === '全部'
        ? articles
        : articles.filter(article => article.category === selectedCategory);

    return (
        <>
            <Header />
            <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.createButton}
                    onClick={() => window.location.href = '/article/create'}
                >
                    ✍️ 发布文章
                </button>
            </div>
            <div className={styles.filters}>
                {categories.map(category => (
                    <button
                        key={category}
                        className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}            
            </div>
            <div className={styles.articleList}>
                {filteredArticles.map(article => (
                    <div key={article.id} className={styles.articleCard}>
                        {article.coverImage && (
                            <img 
                                src={article.coverImage} 
                                alt={article.title}
                                style={{
                                    width: '100%',
                                    height: `${Math.floor(Math.random() * (300 - 150) + 150)}px`,
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '16px'
                                }}
                            />
                        )}
                        <h2 className={styles.articleTitle}>
                            <a href={`/article/${article.id}`}>{article.title}</a>
                        </h2>
                        <div className={styles.articleMeta}>
                            <span>👤 {article.author}</span>
                            <span>📅 {article.date}</span>
                            <span>📚 {article.category}</span>
                            <span>⏱️ {article.readTime}</span>
                        </div>
                        <div className={styles.articleTags}>
                            {article.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                        <p className={styles.articleExcerpt}>
                            {article.content.slice(0, Math.floor(Math.random() * (150 - 50) + 50))}
                            {article.content.length > 150 ? '...' : ''}
                        </p>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Article;