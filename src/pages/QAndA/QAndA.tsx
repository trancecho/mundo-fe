import React, { useState, useEffect } from'react';
import { useNavigate } from'react-router-dom';
import './QAndA.css';
import Header from '@/components/ui/Header/Header.tsx';
import axios from 'axios';
import { getAllPost } from '@/router/api';


// Tag组件，用于展示一个带有文本的标签
interface TagProps {
    text: string; // 标签显示的文本内容
    className?: string; // 可选的自定义类名，用于添加额外的样式
}

const Tag: React.FC<TagProps> = ({ text, className }) => {
    return (
        <div className={`tag ${className? className : ''}`}>
            {text}
        </div>
    );
};

// 定义Message组件的属性接口，对应接口返回数据中的消息相关具体属性
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

// Message组件，用于展示消息相关的信息，根据传入属性展示真实内容
const Message: React.FC<MessageProps> = ({ id, title, content, tags, picture, view, collection, is_completed, answer_count, time, officials }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="Qandamessage" 
            style={officials ? { boxShadow: '0 0 10px hsl(186, 100%, 45%)' } : {}}
            onClick={() => {
                const messageData: MessageProps = {
                    id,
                    title,
                    content,
                    tags,
                    picture,
                    view,
                    collection,
                    is_completed,
                    answer_count,
                    time,
                    officials
                };
                navigate(`/qanda/${id}`);
            }}
        >
            <div className='mes'>
                <div className="messtitle">{title}</div>
                <div className="messinformation">
                    <div className='con'>
                        {content}
                    </div>
                    {picture && picture.length > 0 && (
                        <div className="message-pictures">
                            {picture.map((pic, index) => (
                                <img key={index} src={pic} alt={`图片${index + 1}`} />
                            ))}
                        </div>
                    )}
                </div>
                <div className='TagBroad'>
                    {officials && <Tag text="官方" className='official-tag' />}
                    {tags.map(tag => <Tag key={tag} text={tag} />)}
                </div>
                <div className='YuLanXinXi'>
                    <div className="Qandatime">
                        {time}
                    </div>
                    <div className="message-stats">
                        <div className='YuLan'>浏览量: {view}</div>
                        <div className='YuLan'>收藏量: {collection}</div>
                        <div className='YuLan'>是否完成: {is_completed? '是' : '否'}</div>
                        <div className='YuLan'>回答数量: {answer_count}</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Left组件，包含Buttons组件用于筛选操作，接收点击事件处理函数属性
interface LeftProps {
    onMenuButtonClick: (buttonId: string) => void;
}

const Left: React.FC<LeftProps> = ({ onMenuButtonClick }) => {
    return (
        <div className="left">
            <div className='Menu'>
                <div className='menuCon'>
                    <div
                        id="首页"
                        className='MenuButton clicked'
                        onClick={() => onMenuButtonClick('首页')}
                    >首页</div>
                    <div
                        id="高数"
                        className='MenuButton'
                        onClick={() => onMenuButtonClick('高数')}
                    >高数</div>
                    <div
                        id="大物"
                        className='MenuButton'
                        onClick={() => onMenuButtonClick('大物')}
                    >大物</div>
                    <div
                        id="C语言"
                        className='MenuButton'
                        onClick={() => onMenuButtonClick('C语言')}
                    >C语言</div>
                </div>
            </div>
        </div>
    );
};

// Right组件，根据搜索值、选中菜单过滤并展示消息列表，新增接收selectedFilter参数用于更多筛选逻辑
interface RightProps {
    messages: MessageProps[];
    searchValue: string;
    selectedMenu: string;
    selectedFilter: string;
}

const Right: React.FC<RightProps> = ({ messages, searchValue, selectedMenu, selectedFilter }) => {
    // 根据selectedFilter对消息进行排序
    const sortedMessages = messages.filter(message => {
        if (selectedMenu === '首页') {
            // 当点击"首页"按钮时，显示全部信息，即不过滤直接返回所有消息
            return true;
        }
        if (selectedMenu) {
            return message.tags.includes(selectedMenu);
        }
        if (selectedFilter) {
            // 这里可以根据selectedFilter的值添加具体的筛选逻辑，目前只是示例占位
            return true;
        }
        return (
            message.title.includes(searchValue) ||
            message.content.includes(searchValue) ||
            message.tags.some(tag => tag.includes(searchValue))
        );
    }).sort((a, b) => {
        if (selectedFilter === 'new') {
            // 按时间从最新到最旧排序
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        } else if (selectedFilter === 'hot') {
            // 按浏览量、收藏量和回答数量之和从多到少排序
            const scoreA = a.view + a.collection + a.answer_count;
            const scoreB = b.view + b.collection + b.answer_count;
            return scoreB - scoreA;
        }
        return 0;
    });

    return (
        <div className="right">
            <div className='block'></div>
            {sortedMessages.map(message => (
                <Message key={message.id} {...message} />
            ))}
            <div className='block'></div>
        </div>
    );
};

// QAndA组件，作为整体布局容器，组合了Top、Left、Right组件，管理消息数据、搜索及菜单选择相关状态及逻辑
interface QAndAProps {}

const QAndA: React.FC<QAndAProps> = () => {
    // 用于存储消息列表数据的状态，初始化为空数组
    const [messages, setMessages] = useState<MessageProps[]>([]);
    // 用于存储搜索框中的输入内容的状态
    const [searchValue, setSearchValue] = useState('');
    // 用于记录当前选中的菜单（对应tag内容）的状态
    const [selectedMenu, setSelectedMenu] = useState('');
    // 新增用于记录ChooseButton选择的筛选条件状态
    const [selectedFilter, setSelectedFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 新增加载状态


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        // 这里可以添加一些额外的搜索逻辑，如发送请求到后端等（目前只是简单地更新组件状态，触发重新渲染）
        setSearchValue(searchValue);
    };

    const handleMenuButtonClick = (buttonId: string) => {
        if (buttonId === '首页') {
            setSelectedMenu(buttonId);
            // 点击"首页"按钮时，将selectedFilter也重置为空，确保显示全部信息且不受ChooseButton影响
            setSelectedFilter('');
        } else {
            setSelectedMenu(buttonId);
        }
        updateMenuButtonClasses(buttonId);
    };

    const handleChooseButtonClick = (buttonId: string) => {
        setSelectedFilter(buttonId);
        updateChooseButtonClasses(buttonId);
    };

    // 用于更新所有菜单按钮类名的函数
    const updateMenuButtonClasses = (clickedButtonId: string) => {
        const menuButtons = document.querySelectorAll('.MenuButton');
        menuButtons.forEach((button) => {
            if (button.id === clickedButtonId) {
                button.classList.add('clicked');
            } else {
                button.classList.remove('clicked');
            }
        });
    };

    // 用于更新所有ChooseButton类名的函数
    const updateChooseButtonClasses = (clickedButtonId: string) => {
        const chooseButtons = document.querySelectorAll('.ChooseButton');
        chooseButtons.forEach((button) => {
            if (button.id === clickedButtonId) {
                button.classList.add('clicked');
            } else {
                button.classList.remove('clicked');
            }
        });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true); // 开始加载
            try {
                
                const result = await getAllPost();
                if (result.data && (result.data.hotPosts || result.data.recentPosts)) {
                    // 确保数据结构转换正确
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
                    console.log(result);
                    setMessages(transformedMessages);
                }
            } catch (error) {
                console.error('获取消息数据失败', error);
            } finally {
                setIsLoading(false); // 结束加载
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="background">
            <div className="top">
                <Header onSearchChange={handleSearchChange} onSearch={handleSearch} />
            </div>
            <div className="main">
                <div className='LeftCon'>
                    <Left onMenuButtonClick={handleMenuButtonClick} />
                </div>
                <div>
                    <div className='Choose'>
                        <div className='ChooseCon'>
                            <button
                                className='ChooseButton clicked'
                                id='all'
                                onClick={() => handleChooseButtonClick('all')}
                            >全部</button>
                            <button
                                className='ChooseButton'
                                id='hot'
                                onClick={() => handleChooseButtonClick('hot')}
                            >热门</button>
                            <button
                                className='ChooseButton'
                                id='new'
                                onClick={() => handleChooseButtonClick('new')}
                            >最新</button>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>加载中...</p>
                        </div>
                    ) : (
                        <Right 
                            messages={messages} 
                            searchValue={searchValue} 
                            selectedMenu={selectedMenu} 
                            selectedFilter={selectedFilter} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QAndA;
