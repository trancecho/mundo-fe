import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header/Header';
import './QAndA.css';
import { getMessages } from '@/router/api';

interface QAndAProps {}

interface Message {
  id: number;
  title: string;
  content: string;
  tags: string[];
  views: number;
  replies: number;
  created_at: string;
  is_official: boolean;
  pictures: string[];
}

const QAndA: React.FC<QAndAProps> = () => {
  const [activeFilter, setActiveFilter] = useState('latest');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'tech', name: '技术' },
    { id: 'design', name: '设计' },
    { id: 'research', name: '研究' },
    { id: 'career', name: '职业发展' },
    { id: 'community', name: '社区' }
  ];

  const filters = [
    { id: 'latest', name: '最新' },
    { id: 'popular', name: '热门' },
    { id: 'unanswered', name: '未回答' },
    { id: 'official', name: '官方' }
  ];

  useEffect(() => {
    fetchMessages();
  }, [activeFilter, currentPage, activeCategory]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await getMessages(activeFilter, currentPage, 10, activeCategory);
      setMessages(response.data || []);
      setTotalPages(response.total_pages || 5);
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMessageClick = (messageId: number) => {
    navigate(`/qanda/detail/${messageId}`);
  };

  return (
    <>
      <Header />
      <div className="QandAContainer">
        <div className="left">
          {categories.map(category => (
            <button
              key={category.id}
              className={`MenuButton ${activeCategory === category.id ? 'clicked' : ''}`}
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
                className={`ChooseButton ${activeFilter === filter.id ? 'clicked' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : (
            <>
              {messages.map(message => (
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
                  {message.pictures && message.pictures.length > 0 && (
                    <div className="message-pictures">
                      {message.pictures.map((pic, index) => (
                        <img key={index} src={pic} alt={`图片${index + 1}`} />
                      ))}
                    </div>
                  )}
                  <div className="message-stats">
                    <span>👁️ {message.views} 浏览</span>
                    <span>💬 {message.replies} 回复</span>
                    <span>🕒 {new Date(message.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

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
                      className={currentPage === page ? 'active' : ''}
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
          )}
        </div>
      </div>
    </>
  );
};

export default QAndA;
