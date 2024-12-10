import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { Card } from "@/components/ui/card"; // 使用shadcn的Card组件

const questions = [
    { id: 1, title: '如何注册账号？', answer: '您可以通过点击注册按钮进行注册。' },
    { id: 2, title: '如何加入活动？', answer: '您可以在活动详情页面申请加入。' },
    { id: 3, title: '如何联系管理员？', answer: '请通过邮箱联系我们的管理员。' },
    { id: 4, title: '如何重置密码？', answer: '您可以通过“忘记密码”链接来重置密码。' },
    { id: 5, title: '如何查看我的账户信息？', answer: '在用户中心页面中，您可以查看并更新您的账户信息。' },
    { id: 6, title: '如何更改账户设置？', answer: '点击账户设置按钮，您可以修改个人资料、密码以及通知偏好等设置。' },
    { id: 7, title: '如何退出登录？', answer: '点击页面右上角的退出按钮即可退出当前账户。' },
];

const QuestionList: React.FC = () => {
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

    const handleQuestionClick = (id: number) => {
        setSelectedQuestion(id === selectedQuestion ? null : id); // Toggle between selected and unselected
    };

    // 使用useEffect来确保选中后触发动画
    useEffect(() => {
        if (selectedQuestion !== null) {
            const answerElement = document.getElementById(`answer-${selectedQuestion}`);
            if (answerElement) {
                gsap.to(answerElement, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'expo.out',
                });
            }
        }
    }, [selectedQuestion]); // 监听 selectedQuestion 的变化

    return (
        <div>
            <ul>
                {questions.map((question) => (
                    <li
                        key={question.id}
                        onClick={() => handleQuestionClick(question.id)} // 控制状态切换
                        className="my-1" // 每个问题的外边距
                    >
                        <Card
                            className="p-1 cursor-pointer rounded-md hover:bg-blue-200 transition-all shadow-none border-none" // Card组件包裹问题，悬浮效果
                        >
                            <span className="text-xs text-[#3085F3]">{question.title}</span>
                            <div
                                id={`answer-${question.id}`}
                                style={{
                                    overflow: 'hidden',
                                    maxHeight: selectedQuestion === question.id ? '1000px' : '0',
                                    opacity: selectedQuestion === question.id ? 1 : 0,
                                    transition: 'opacity 0.3s ease-out',
                                }}
                            >
                                <p className='text-xs' style={{ color: '#555' }}>{question.answer}</p>
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionList;
