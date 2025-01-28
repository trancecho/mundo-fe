import React, { useState, useEffect } from'react';
import { useNavigate } from'react-router-dom';
import './QAndA.css';
import Header from '@/components/ui/Header/Header.tsx';

import axios from 'axios';

// 生成随机字符串的函数
function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 生成随机图片URL的函数
function generateRandomImageUrl() {
    return `https://picsum.photos/200/300?random=${Math.random()}`;
}

// 生成随机时间的函数，生成过去一年内的随机时间
function generateRandomTime() {
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const randomTime = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
    return randomTime.toISOString();
}

// 从给定数组中随机选择标签
function generateRandomTags() {
    const tagOptions = ['C语言', '高数', '大物'];
    const numTags = Math.floor(Math.random() * 3) + 1; // 随机选择1到3个标签
    const selectedTags = [];
    for (let i = 0; i < numTags; i++) {
        const randomIndex = Math.floor(Math.random() * tagOptions.length);
        selectedTags.push(tagOptions[randomIndex]);
    }
    return selectedTags;
}

// 生成随机消息数据的函数
function generateRandomMessages(count = 10) {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `随机标题 ${generateRandomString(5)}`,
        content: `随机内容 ${generateRandomString(30)}`,
        tags: generateRandomTags(),
        picture: [generateRandomImageUrl()],
        view: Math.floor(Math.random() * 100),
        collection: Math.floor(Math.random() * 50),
        is_completed: Math.random() > 0.5,
        answer_count: Math.floor(Math.random() * 10),
        time: generateRandomTime()
    }));
}


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
    picture: string[];
    view: number;
    collection: number;
    is_completed: boolean;
    answer_count: number;
    time: string;
}

// Message组件，用于展示消息相关的信息，根据传入属性展示真实内容
const Message: React.FC<MessageProps> = ({ id, title, content, tags, picture, view, collection, is_completed, answer_count, time }) => {
    const navigate = useNavigate();

    return (
        <div className="Qandamessage" onClick={() => {
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
                time
            };
            navigate(`/qanda/${id}`);
        }}>
            <div className='mes'>
                <div className="messtitle">{title}</div>
                <div className="messinformation">
                    <div className='con'>
                        {content}
                    </div>
                    {picture.length > 0 && (
                        <div className="message-pictures">
                            {picture.map((pic, index) => (
                                <img key={index} src={pic} alt={`图片${index + 1}`} />
                            ))}
                        </div>
                    )}
                </div>
                <div className='TagBroad'>
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
            // 当点击“首页”按钮时，显示全部信息，即不过滤直接返回所有消息
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
    // 用于存储消息列表数据的状态，初始化为随机生成的数据
    const [messages, setMessages] = useState<MessageProps[]>(generateRandomMessages());
    // 用于存储搜索框中的输入内容的状态
    const [searchValue, setSearchValue] = useState('');
    // 用于记录当前选中的菜单（对应tag内容）的状态
    const [selectedMenu, setSelectedMenu] = useState('');
    // 新增用于记录ChooseButton选择的筛选条件状态
    const [selectedFilter, setSelectedFilter] = useState('');
    const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VybmFtZSI6IuS5neaAnSIsInJvbGUiOiJhZG1pbiIsImlzcyI6Im11bmRvLWF1dGgtaHViIiwiZXhwIjoxNzM4Mzc4MjEwLCJpYXQiOjE3Mzc3NzM0MTB9.SdfFdFvSoTGMSCs5r3o7JCnMEKamZJPgsHATUlFoO-E');

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
            // 点击“首页”按钮时，将selectedFilter也重置为空，确保显示全部信息且不受ChooseButton影响
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
            try {
                const myHeaders = new Headers();

                myHeaders.append("User - Agent", "Apifox/1.0.0 (https://apifox.com)");
                // 使用默认token
                myHeaders.append("Authorization", `Bearer ${token}`);
                myHeaders.append("Accept", "*/*");
                myHeaders.append("Host", "116.198.207.159:12349");
                myHeaders.append("Connection", "keep - alive");

                const requestOptions: RequestInit = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow' as RequestRedirect
                };

                const response = await fetch("http://116.198.207.159:12349/api/question/post?service=mundo", requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.data && (result.data.hotPosts || result.data.recentPosts)) {
                    // 确保数据结构转换正确
                    const transformedMessages = result.data.hotPosts.concat(result.data.recentPosts).map((msg: any) => ({
                        id: msg.id,
                        title: msg.title,
                        content: msg.content,
                        tags: msg.tags,
                        picture: msg.picture,
                        view: msg.view,
                        collection: msg.collection,
                        is_completed: msg.isCompleted || false,
                        answer_count: msg.answerCount,
                        time: msg.time
                    }));
                    setMessages([...messages,...transformedMessages]);
                }
            } catch (error) {
                console.error('获取消息数据失败', error);
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
                    <Right messages={messages} searchValue={searchValue} selectedMenu={selectedMenu} selectedFilter={selectedFilter} />
                </div>
            </div>
        </div>
    );
};

export default QAndA;
