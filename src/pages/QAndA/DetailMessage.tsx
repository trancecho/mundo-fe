import React, { useEffect, useState } from 'react';
import './DetailMessage.css';
import Header from '@/components/ui/Header/Header';
import { useLocation } from 'react-router-dom';

// 定义问题帖子的数据类型
interface QuestionPost {
    id: number;
    uid: number;
    title: string;
    content: string;
    picture: string[];
    view: number;
    collection: number;
    is_completed: false;
    answer_count: number;
    tags: string[];
}

// 定义答案的数据类型
interface Answer {
    id: number;
    uid: number;
    content: string;
    question_post_id: number;
    picture: string[];
    like: number;
    tags: string[] | null;
}

interface DetailQuestionProps {
    title: string;
    time: string;
    question: string;
}

// 创建一个上下文，用于传递问题相关的图片和标签数据到DetailQuestion组件
const QuestionContext = React.createContext<{ picture: string[]; tags: string[] }>({
    picture: [],
    tags: []
});

// 定义DetailQuestion组件类型，调整此处使其内部渲染图片和标签更合理
const DetailQuestion: React.FC<DetailQuestionProps> = ({ title, time, question }) => {
    const { picture, tags } = React.useContext(QuestionContext); // 通过上下文获取图片和标签数据（后面会创建上下文）
    return (
        <div className='DetailQuestion'>
            <div className='detailtitle'>{title}</div>
            <div className='time'>{time}</div>
            <div className='detailquestion'>{question}</div>
            {picture.length > 0 && (
                <div className="question-pictures">
                    {picture.map((pic: string, index: number) => (
                        <img key={index} src={pic} alt={`问题相关图片${index + 1}`} />
                    ))}
                </div>
            )}
            <div className='TagBroad'>
                {tags.map(tag => <div key={tag} className='tag'>{tag}</div>)}
            </div>
        </div>
    );
};

// 定义DetailReply组件类型，接收answerData作为属性，类型为Answer
const DetailReply: React.FC<{ answerData: Answer }> = ({ answerData }) => {
    return (
        <div className='DetailReply'>
            <div className='UserAndTime'>
                <div className='username'>回答者</div>
                <div className='ReplyTime'>回答时间（可根据实际情况补充获取时间逻辑）</div>
            </div>
            <div className='AnswerText'>
                {answerData.content}
            </div>
        </div>
    );
};

const DetailMessage: React.FC = () => {
    const location = useLocation();
    const [answersData, setAnswersData] = useState<Answer[]>([]);
    const { message } = location.state || {};

    // 为避免接收到的消息数据部分属性可能为空的情况，添加默认值处理（可根据实际情况调整默认值内容）
    const defaultMessage: QuestionPost = {
        id: 0,
        uid: 0,
        title: '无标题',
        content: '无内容',
        picture: [],
        view: 0,
        collection: 0,
        is_completed: false,
        answer_count: 0,
        tags: []
    };
    const finalMessage: QuestionPost = {...defaultMessage,...message };

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNiwidXNlcm5hbWUiOiJqdWljZSIsInJvbGUiOiJ1c2VyIiwiaXNzIjoibXVuZG8tYXV0aC1odWIiLCJleHAiOjE3MzUzNjk3NzgsImlhdCI6MTczNDc2NDk3OH0.sttCChl7GPiSJo02X1aEODd_ic8_faPTCd_Wrtf0a5A");

        var requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://116.198.207.159:12349/api/question/posts/?service=mundo", requestOptions)
        .then(response => response.json())
        .then((result: { code: number; data: { Answers: Answer[] } }) => {
                if (result.code === 200 && result.data && result.data.Answers) {
                    setAnswersData(result.data.Answers);
                }
            })
        .catch(error => console.log('error', error));
    }, []);

    return (
        <div className='background'>
            <div>
                <Header onSearchChange={() => {}} onSearch={() => {}} />
            </div>
            <QuestionContext.Provider value={{ picture: finalMessage.picture, tags: finalMessage.tags }}>
                <div className='DetailMessage'>
                    <DetailQuestion
                        title={finalMessage.title}
                        time={finalMessage.time}
                        question={finalMessage.content}
                    />
                    <div className='detailanswer'>
                        <div className='CreateNewReply'>新建回答</div>
                        <div className='reply-list'>
                            {answersData.length > 0? (
                                answersData.map((answer, index) => (
                                    <DetailReply key={index} answerData={answer} />
                                ))
                            ) : (
                                <div className="no-answer-tip">无人回答</div>
                            )}
                        </div>
                    </div>
                </div>
            </QuestionContext.Provider>
        </div>
    );
};

export default DetailMessage;