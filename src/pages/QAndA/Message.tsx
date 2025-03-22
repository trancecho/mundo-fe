// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './QAndA.css';
// import { Tag } from './Tag';
//
// // 定义Message组件的属性接口，对应接口返回数据中的消息相关具体属性
// interface MessageProps {
//     id: number;
//     title: string;
//     content: string;
//     tags: string[];
//     picture: string[] | null;
//     view: number;
//     collection: number;
//     is_completed: boolean;
//     answer_count: number;
//     time: string;
//     officials: boolean;
// }
//
// // Message组件，用于展示消息相关的信息，根据传入属性展示真实内容
// export const Message: React.FC<MessageProps> = ({ id, title, content, tags, picture, view, collection, is_completed, answer_count, time, officials }) => {
//     const navigate = useNavigate();
//
//     return (
//         <div
//             className="Qandamessage"
//             style={officials ? { boxShadow: '0 0 10px hsl(186, 100%, 45%)' } : {}}
//             onClick={() => {
//                 const messageData: MessageProps = {
//                     id,
//                     title,
//                     content,
//                     tags,
//                     picture,
//                     view,
//                     collection,
//                     is_completed,
//                     answer_count,
//                     time,
//                     officials
//                 };
//                 navigate(`/qanda/${id}`);
//             }}
//         >
//             <div className='mes'>
//                 <div className="messtitle">{title}</div>
//                 <div className="messinformation">
//                     <div className='con'>
//                         {content}
//                     </div>
//                     {picture && picture.length > 0 && (
//                         <div className="message-pictures">
//                             {picture.map((pic, index) => (
//                                 <img key={index} src={pic} alt={`图片${index + 1}`} />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//                 <div className='TagBroad'>
//                     {officials && <Tag text="官方" className='official-tag' />}
//                     {tags.map(tag => <Tag key={tag} text={tag} />)}
//                 </div>
//                 <div className='YuLanXinXi'>
//                     <div className="Qandatime">
//                         {time}
//                     </div>
//                     <div className="message-stats">
//                         <div className='YuLan'>浏览量: {view}</div>
//                         <div className='YuLan'>收藏量: {collection}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QAndA.css';
import { Tag } from './Tag';

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

export const Message: React.FC<MessageProps> = (props) => {
    const navigate = useNavigate();

    return (
        <div
            className="message-card"
            onClick={() => navigate(`/qanda/${props.id}`)}
        >
            {/* 标题 */}
            <div className="message-header">
                <h3>{props.title}</h3>
                {props.officials && <Tag text="官方" className="official-tag" />}
            </div>

            {/* 内容 */}
            <div className="message-content">
                <p>{props.content}</p>
            </div>

            {/* 标签 */}
            <div className="message-tags">
                {props.tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                ))}
            </div>

            {/* 统计信息 */}
            <div className="message-stats">
                <span>👁️ {props.view}</span>
                <span>❤️ {props.collection}</span>
                <span>💬 {props.answer_count}</span>
                <span>🕒 {props.time}</span>
            </div>
        </div>
    );
};