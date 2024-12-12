import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import QuestionList from './QuestionList';
import { QQLink } from './QQLink';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from "@/components/ui/card";
import AIChat from './AiChat';
import styles from './AnswerWindow.module.css';

const AnswerWindow: React.FC = () => {
    const windowRef = useRef(null);

    useEffect(() => { //被渲染后调用钩子，执行动画
        if (windowRef.current) {
            // 使用 GSAP 动画让窗口从下方滑入，透明度从 0 到 1，位置从 50px 到 0
            gsap.from(windowRef.current, { opacity: 0, y: 50, duration: 0.5 });
            // 确保在动画结束时，元素的透明度为 1，位置为 0
            gsap.to(windowRef.current, { opacity: 1, y: 0, duration: 0.5 });
        }
    }, []);

    return (
        <div
            ref={windowRef}
            className={styles.answerWindow}
        >
            <ScrollArea>
                <div className={styles.answerWindow_title}>
                    常见问题
                </div>
                <div className={styles.box_styles_contain}>
                    <QuestionList />
                </div>
                <div className={styles.box_styles_contain}>
                    <QQLink />
                </div>
                <div className={styles.box_styles_contain}>
                    <AIChat />
                </div>

            </ScrollArea>
        </div>
    );
};

export default AnswerWindow;
