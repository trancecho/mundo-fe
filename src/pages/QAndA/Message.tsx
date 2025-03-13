import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QAndA.css';
import { Tag } from './Tag';

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

// 处理 Base64 图片的组件
const SecureImage: React.FC<{ image: string }> = ({ image }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const convertBase64ToBlobUrl = () => {
            // 移除可能存在的 Base64 前缀
            const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        };

        convertBase64ToBlobUrl();
    }, [image]);

    if (!imageUrl) {
        return <p>加载中...</p>;
    }

    return <img src={imageUrl} alt="图片" />;
};

// Message组件，用于展示消息相关的信息，根据传入属性展示真实内容
export const Message: React.FC<MessageProps> = ({ id, title, content, tags, picture, view, collection, is_completed, answer_count, time, officials }) => {
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
                                <SecureImage key={index} image={pic} />
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
                    </div>
                </div>
            </div>
        </div>
    );
};
