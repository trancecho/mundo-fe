import React, { useState, useEffect } from'react';
import './QAndA.css';
import Header from '@/components/ui/Header/Header.tsx';
import { getAllPost } from '@/router/api';
import { Left } from './Left';
import { Message } from './Message';

// QAndA组件，作为整体布局容器，组合了Top、Left、Right组件，管理消息数据、搜索及菜单选择相关状态及逻辑
interface QAndAProps {}

const QAndA: React.FC<QAndAProps> = () => {
    // 用于存储消息列表数据的状态，初始化为空数组
    const [messages, setMessages] = useState<MessageProps[]>([]);
    // 用于存储官方帖子的数组
    const [officialMessages, setOfficialMessages] = useState<MessageProps[]>([]);
    // 用于存储搜索框中的输入内容的状态
    const [searchValue, setSearchValue] = useState('');
    // 用于记录当前选中的菜单（对应tag内容）的状态
    const [selectedMenu, setSelectedMenu] = useState('首页');
    // 新增用于记录ChooseButton选择的筛选条件状态
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true); // 新增加载状态，初始为true
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [messagesPerPage] = useState(10); // 每页显示的消息数量
    const [showPageInput, setShowPageInput] = useState(false); // 控制页码输入框显示
    const [inputPage, setInputPage] = useState(''); // 输入的页码

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        setSearchValue(searchValue);
        setCurrentPage(1); // 搜索时重置页码
    };

    const handleMenuButtonClick = (buttonId: string) => {
        if (buttonId === '首页') {
            setSelectedMenu(buttonId);
            setSelectedFilter('all');
        } else {
            setSelectedMenu(buttonId);
        }
        setCurrentPage(1); // 切换菜单时重置页码
    };

    const handleChooseButtonClick = (buttonId: string) => {
        setSelectedFilter(buttonId);
        setCurrentPage(1); // 切换筛选条件时重置页码
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const result = await getAllPost();
                console.log('获取到的数据:', result);
                if (result.data && (result.data.hotPosts || result.data.recentPosts)) {
                    const transformedMessages = result.data.hotPosts.concat(result.data.recentPosts).map((msg: any) => ({
                        id: msg.id,
                        title: msg.title,
                        content: msg.content,
                        tags: msg.tags,
                        picture: msg.picture || null,
                        view: msg.view,
                        collection: msg.collection,
                        is_completed: msg.isCompleted || false,
                        answer_count: msg.answerCount,
                        time: msg.time,
                        officials: msg.officials || false
                    }));
                    setMessages(transformedMessages);
                    // 筛选出官方帖子
                    const officialPosts = transformedMessages.filter(message => message.officials);
                    setOfficialMessages(officialPosts);
                }
            } catch (error) {
                console.error('获取消息数据失败', error);
            } finally {
                setIsLoading(false); // 结束加载
            }
        };

        fetchMessages();
    }, []);

    // 根据筛选条件获取要显示的消息
    const getDisplayMessages = () => {
        if (selectedFilter === 'official') {
            return officialMessages;
        }
        return messages;
    };

    const displayMessages = getDisplayMessages();

    // 过滤消息
    const filteredMessages = displayMessages.filter((message) => {
        const searchMatch = message.title.toLowerCase().includes(searchValue.toLowerCase()) || message.content.toLowerCase().includes(searchValue.toLowerCase());
        const tagMatch = selectedMenu === '首页' || message.tags.includes(selectedMenu);
        let filterMatch = false;
        switch (selectedFilter) {
            case 'all':
                filterMatch = true;
                break;
            case '已完成':
                filterMatch = message.is_completed;
                break;
            case 'hot':
            case 'new':
                filterMatch = true;
                break;
            case 'official':
                filterMatch = message.officials;
                break;
            default:
                filterMatch = false;
        }
        return searchMatch && tagMatch && filterMatch;
    });

    // 根据筛选条件排序
    const sortedMessages = filteredMessages.sort((a, b) => {
        if (selectedFilter === 'hot') {
            const scoreA = a.view + a.collection;
            const scoreB = b.view + b.collection;
            return scoreB - scoreA;
        } else if (selectedFilter === 'new') {
            return b.id - a.id;
        }
        return 0;
    });

    // 计算当前页显示的消息
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = sortedMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    // 总页数
    const totalPages = Math.ceil(sortedMessages.length / messagesPerPage);

    // 处理页码切换
    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // 上一页
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 下一页
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 处理页码输入
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value);
    };

    // 处理页码跳转
    const handlePageJump = () => {
        const page = parseInt(inputPage, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setShowPageInput(false);
            setInputPage('');
        } else {
            alert('页码错误，请输入有效的页码。');
        }
    };

    // 生成页码列表
    const renderPagination = () => {
        if (totalPages <= 8) {
            return Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={currentPage === index + 1? 'active' : ''}
                >
                    {index + 1}
                </button>
            ));
        }

        const pages = [];
        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={currentPage === i? 'active' : ''}
                    >
                        {i}
                    </button>
                );
            }
            pages.push(<span key="ellipsis1" onClick={() => setShowPageInput(true)}>...</span>);
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className={currentPage === totalPages? 'active' : ''}
                >
                    {totalPages}
                </button>
            );
        } else if (currentPage >= totalPages - 3) {
            pages.push(
                <button
                    key={1}
                    onClick={() => paginate(1)}
                    className={currentPage === 1? 'active' : ''}
                >
                    1
                </button>
            );
            pages.push(<span key="ellipsis2" onClick={() => setShowPageInput(true)}>...</span>);
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={currentPage === i? 'active' : ''}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            pages.push(
                <button
                    key={1}
                    onClick={() => paginate(1)}
                    className={currentPage === 1? 'active' : ''}
                >
                    1
                </button>
            );
            pages.push(<span key="ellipsis3" onClick={() => setShowPageInput(true)}>...</span>);
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={currentPage === i? 'active' : ''}
                    >
                        {i}
                    </button>
                );
            }
            pages.push(<span key="ellipsis4" onClick={() => setShowPageInput(true)}>...</span>);
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className={currentPage === totalPages? 'active' : ''}
                >
                    {totalPages}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="background">
            <div className="top">
                <Header onSearchChange={handleSearchChange} onSearch={handleSearch} />
            </div>
            <div className="main">
                {isLoading? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>加载中...</p>
                    </div>
                ) : (
                    <>
                        <div className='LeftCon'>
                            <Left onMenuButtonClick={handleMenuButtonClick} />
                        </div>
                        <div className="right">
                            <div className='Choose'>
                                <div className='ChooseCon'>
                                    <button
                                        className={`ChooseButton ${selectedFilter === 'all'? 'clicked' : ''}`}
                                        id='all'
                                        onClick={() => handleChooseButtonClick('all')}
                                    >全部</button>
                                    <button
                                        className={`ChooseButton ${selectedFilter === 'hot'? 'clicked' : ''}`}
                                        id='hot'
                                        onClick={() => handleChooseButtonClick('hot')}
                                    >热门</button>
                                    <button
                                        className={`ChooseButton ${selectedFilter === 'new'? 'clicked' : ''}`}
                                        id='new'
                                        onClick={() => handleChooseButtonClick('new')}
                                    >最新</button>
                                    <button
                                        className={`ChooseButton ${selectedFilter === 'official'? 'clicked' : ''}`}
                                        id='official'
                                        onClick={() => handleChooseButtonClick('official')}
                                    >官方</button>
                                </div>
                            </div>
                            <div className='block'></div>
                            {currentMessages.map(message => (
                                <Message key={message.id} {...message} />
                            ))}
                            <div className='block'></div>
                            <div className="pagination">
                                <button onClick={prevPage} disabled={currentPage === 1}>
                                    上一页
                                </button>
                                {renderPagination()}
                                <button onClick={nextPage} disabled={currentPage === totalPages}>
                                    下一页
                                </button>
                                {showPageInput && (
                                    <div className="page-input">
                                        <input
                                            type="text"
                                            value={inputPage}
                                            onChange={handlePageInputChange}
                                            placeholder="输入页码"
                                        />
                                        <button onClick={handlePageJump}>跳转</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

interface MessageProps {
    id: number;
    title: string;
    content: string;
    tags: string[];
    picture: string[] | null;
    view: number;
    collection: number;
    is_completed: boolean;
    answer_count: number;
    time: string;
    officials: boolean;
}

export default QAndA;
