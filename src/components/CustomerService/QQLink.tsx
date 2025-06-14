import PulsatingButton from '@/components/ui/pulsating-button'
export function QQLink() {
  return (
    <a
      href='https://qm.qq.com/q/EXqSU1ZBZ0'
      target='_blank'
      rel='noopener noreferrer' // 安全性设置，防止钓鱼攻击
      className='w-full'
    >
      <PulsatingButton>问题无法解决?点我加群咨询！</PulsatingButton>
    </a>
  )
}
