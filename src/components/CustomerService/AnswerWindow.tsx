import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import QuestionList from './QuestionList'; 
import { QQLink } from './QQLink';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from "@/components/ui/card";
import AIChat from './AiChat';
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
            style={{
                position: 'fixed',
                bottom: '60px',
                right: '20px',
                width: '300px',
                height: '500px',
                background: 'linear-gradient(to bottom, #3085f3 10%, #6a9bf3 20%, #fff 60% )',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <ScrollArea>
                <h2><strong className="text-stone-50 text-2xl">
                    常见问题
                </strong></h2>
                <Card className="p-2 mt-2 rounded-md">
                    <QuestionList />
                </Card>
                <QQLink/>
                <AIChat/>
            </ScrollArea>
        </div>
    );
};

export default AnswerWindow;
