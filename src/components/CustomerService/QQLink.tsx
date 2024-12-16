import PulsatingButton from "@/components/ui/pulsating-button";
import styles from './AnswerWindow.module.css'
export function QQLink() {
    return (
        // <div className={styles.box_styles_touchable}>

        <a
            href="https://qm.qq.com/q/ebWjUnhSQE"
            target="_blank"
            rel="noopener noreferrer"  // 安全性设置，防止钓鱼攻击
            className="w-full"
        >
            <PulsatingButton className={styles.qq_small_font}>问题无法解决？别怕！点我加群咨询！</PulsatingButton>
        </a>


        // </div>
    );
}
