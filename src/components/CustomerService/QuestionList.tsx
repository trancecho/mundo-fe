import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import styles from './AnswerWindow.module.css'
const questions = [
    { id: 1, title: '如何注册账号？', answer: '目前支持邮箱注册' },
    { id: 3, title: '如何联系管理员？', answer: '请通过邮箱联系我们的管理员。' },
    { id: 4, title: '如何重置密码？', answer: '您可以通过“忘记密码”链接来重置密码。' },
    { id: 5, title: '如何查看我的账户信息？', answer: '在用户中心页面中，您可以查看并更新您的账户信息。' },
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
                        <div className={styles.box_styles_touchable}>
                            <div className={styles.font_styles}>{question.title}</div>
                            <div
                                id={`answer-${question.id}`}
                                style={{
                                    overflow: 'hidden',
                                    maxHeight: selectedQuestion === question.id ? '1000px' : '0',
                                    opacity: selectedQuestion === question.id ? 1 : 0,
                                    transition: 'opacity 0.3s ease-out',
                                }}
                            >
                                <p className={styles.font_styles} >{question.answer}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionList;
