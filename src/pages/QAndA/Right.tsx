import React from'react';
import './QAndA.css';
import { Message } from './Message';

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

// Right组件，根据搜索值、选中菜单过滤并展示消息列表，新增接收selectedFilter参数用于更多筛选逻辑
interface RightProps {
    messages: MessageProps[];
    searchValue: string;
    selectedMenu: string;
    selectedFilter: string;
    handleChooseButtonClick: (buttonId: string) => void;
}

export const Right: React.FC<RightProps> = ({ messages, searchValue, selectedMenu, selectedFilter, handleChooseButtonClick }) => {
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
                </div>
            </div>
            <div className='block'></div>
            {sortedMessages.map(message => (
                <Message key={message.id} {...message} />
            ))}
            <div className='block'></div>
        </div>
    );
};
