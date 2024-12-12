import styles from './AnswerWindow.module.css'
export function QQLink() {
    return (
        <div className={styles.box_styles_touchable}>
            <a
                href="https://qm.qq.com/q/ebWjUnhSQE"
                target="_blank"
                rel="noopener noreferrer"  // 安全性设置，防止钓鱼攻击
                className="w-full"  
            >
                <div className={styles.font_styles}>
                    问题无法解决？点我加群咨询！
                </div>
            </a>
        </div>
    );
}
