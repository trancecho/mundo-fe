import React, { useState, useEffect } from'react';
import { useNavigate, useLocation } from'react-router-dom';
import Header from '@/components/ui/Header/Header';
import './QAndA.css';
import { getMessages, Message, ResponseData } from '@/router/api';

const QAndA: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState('latest');
    const [messages, setMessages] = useState<Message[]>([]);
    const [allFilteredMessages, setAllFilteredMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCategory, setActiveCategory] = useState('all');
    const [error, setError] = useState<string | null>(null);
    const [showSubjectMenu, setShowSubjectMenu] = useState(false);
    const [activeSubject, setActiveSubject] = useState('');
    const [isSubjectButtonClicked, setIsSubjectButtonClicked] = useState(false);

    const categories = [
        { id: 'tech', name: '技术' },
        { id: 'design', name: '设计' },
        { id:'research', name: '研究' },
        { id: 'career', name: '职业发展' },
        { id: 'community', name: '社区' }
    ];

    const filters = [
        { id: 'latest', name: '最新' },
        { id: 'popular', name: '热门' },
        { id: 'unanswered', name: '未回答' },
        { id: 'official', name: '官方' },
    ];

    const subjects = ['大物', '高数', 'C语言'];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter') || 'latest';
        const category = params.get('category') || 'all';
        setActiveFilter(filter);
        setActiveCategory(category);
        fetchMessages();
    }, [location]);

    const fetchMessages = async () => {
        setMessages([]);
        setLoading(true);
        setError(null);
        try {
            const response: ResponseData = await getMessages();
            const hotPosts = Array.isArray(response.hotPosts)? response.hotPosts : [];
            const recentPosts = Array.isArray(response.recentPosts)? response.recentPosts : [];
            const combinedMessages = [...hotPosts, ...recentPosts].map(message => ({
               ...message,
                views: message.view,
                replies: message.answer_count
            }));

            let filteredMessages = combinedMessages;
            if (activeCategory!== 'all') {
                filteredMessages = combinedMessages.filter(message => {
                    const tags = message.tags || [];
                    return tags.includes(activeCategory);
                });
            }

            if (activeSubject) {
                filteredMessages = filteredMessages.filter(message => {
                    const tags = message.tags || [];
                    return tags.includes(activeSubject);
                });
            }

            switch (activeFilter) {
                case 'latest':
                    filteredMessages.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateB.getTime() - dateA.getTime();
                    });
                    break;
                case 'popular':
                    filteredMessages.sort((a, b) => {
                        const viewsA = Number(a.view);
                        const repliesA = Number(a.answer_count);
                        const viewsB = Number(b.view);
                        const repliesB = Number(b.answer_count);
                        return (viewsB + repliesB) - (viewsA + repliesA);
                    });
                    break;
                case 'unanswered':
                    filteredMessages = combinedMessages.filter(message => message.answer_count === 0);
                    break;
                case 'official':
                    filteredMessages = combinedMessages.filter(message => message.is_official);
                    break;
                default:
                    break;
            }

            const pageSize = 20;
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

            setMessages(paginatedMessages);
            setAllFilteredMessages(filteredMessages);
            const total = filteredMessages.length;
            setTotalPages(Math.ceil(total / pageSize));
        } catch (error: any) {
            console.error('获取消息失败:', error);
            if (error.response) {
                console.error('服务器响应错误:', error.response.data);
                console.error('状态码:', error.response.status);
            } else if (error.request) {
                console.error('请求已发送，但没有收到响应:', error.request);
            } else {
                console.error('发生错误:', error.message);
            }
            setError('获取消息时发生错误，请稍后再试。');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterId: string) => {
        setActiveFilter(filterId);
        setCurrentPage(1);
        const params = new URLSearchParams(location.search);
        params.set('filter', filterId);
        params.set('category', activeCategory);
        navigate({
            pathname: location.pathname,
            search: params.toString()
        });
        const button = document.querySelector(`button[onclick*="${filterId}"]`);
        if (button) {
            button.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId);
        setCurrentPage(1);
        const params = new URLSearchParams(location.search);
        params.set('category', categoryId);
        params.set('filter', activeFilter);
        navigate({
            pathname: location.pathname,
            search: params.toString()
        });
        const button = document.querySelector(`button[onclick*="${categoryId}"]`);
        if (button) {
            button.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchMessages();
    };

    const handleMessageClick = (messageId: number) => {
        navigate(`/qanda/detail/${messageId}`);
    };

    const handleSubjectButtonClick = () => {
        setIsSubjectButtonClicked(!isSubjectButtonClicked);
        setShowSubjectMenu(!showSubjectMenu);
        if (!isSubjectButtonClicked) {
            setActiveSubject('');
        }
        setCurrentPage(1);
        fetchMessages();
    };

    const handleSubjectSelect = async (subject: string) => {
        setActiveSubject(subject);
        setCurrentPage(1);
        setLoading(true); // 开始筛选时显示加载状态
        await fetchMessages(); // 等待筛选完成
    };

    return (
        <>
            <Header />
            <div className="QandAContainer">
                <div className="left">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`MenuButton ${activeCategory === category.id? 'clicked' : ''}`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <div className="right">
                    <div className="Choose">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                className={`ChooseButton ${activeFilter === filter.id? 'clicked' : ''}`}
                                onClick={() => handleFilterChange(filter.id)}
                            >
                                {filter.name}
                            </button>
                        ))}
                        <div className="subject-button-container">
                            <button
                                className={`ChooseButton ${isSubjectButtonClicked? 'clicked' : ''}`}
                                onClick={handleSubjectButtonClick}
                            >
                                科目
                            </button>
                            {showSubjectMenu && (
                                <div className="Choose">
                                    {subjects.map((subject, index) => (
                                        <button
                                            key={index}
                                            className={`ChooseButton ${activeSubject === subject? 'clicked' : ''}`}
                                            onClick={() => handleSubjectSelect(subject)}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {loading? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>加载中...</p>
                        </div>
                    ) : error? (
                        <div className="error-container">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {messages.length > 0? (
                                <>
                                    {messages.map(message => {
                                        return (
                                            <div
                                                key={message.id}
                                                className="Qandamessage"
                                                onClick={() => handleMessageClick(message.id)}
                                            >
                                                <div className="messtitle">{message.title}</div>
                                                <div className="con">
                                                    {message.content.length > 150
                                                      ? `${message.content.substring(0, 150)}...`
                                                       : message.content}
                                                </div>
                                                <div className="TagBroad">
                                                    {message.is_official && <span className="tag">官方</span>}
                                                    {message.tags.map((tag, index) => (
                                                        <span key={index} className="tag">{tag}</span>
                                                    ))}
                                                </div>
                                                {message.picture && message.picture.length > 0 && (
                                                    <div className="message-pictures">
                                                        {message.picture.map((pic, index) => (
                                                            <img
                                                                key={index}
                                                                src={`data:image/jpeg;base64,${pic}`}
                                                                alt={`图片${index + 1}`}
                                                                onError={() => {
                                                                    console.error('图片加载失败:', pic);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="message-stats">
                                                    <span>👁️ {message.view} 浏览</span>
                                                    <span>💬 {message.answer_count} 回复</span>
                                                    <span>🕒 {new Date(message.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {messages.length > 0 && (
                                        <div className="pagination">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                上一页
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    className={currentPage === page? 'active' : ''}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                下一页
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="no-results-container">
                                    <p>没有找到对应信息</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default QAndA;