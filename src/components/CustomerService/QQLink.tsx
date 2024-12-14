import { Card } from "@/components/ui/card"; // 使用shadcn的Card组件
export function QQLink() {
    return (
        <div >
            <Card
                className="p-2 mt-2 cursor-pointer rounded-md hover:bg-blue-200 transition-all w-full text-left"
            >
                <a
                    href="https://qm.qq.com/q/ebWjUnhSQE" 
                    target="_blank"  
                    rel="noopener noreferrer"  // 安全性设置，防止钓鱼攻击
                    className="w-full text-left"  // 保证链接占满整个卡片
                >
                    <span className="text-[#3085F3] text-sm">
                        问题无法解决？点我加群咨询！
                    </span>
                </a>

            </Card>
        </div>

    );
}
