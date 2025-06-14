import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Modal, Notification } from '@arco-design/web-react'
import styles from './AnswerWindow.module.css'
import { createFeedBack } from '@/router/api'

const HumanChat: React.FC = () => {
  const [inputText, setInputText] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  const handleSendFeedBack = async () => {
    try {
      await createFeedBack(inputText)
      Notification.success({
        title: 'Success',
        content: '反馈成功！！'
      })
      setVisible(false)
    } catch {
      Notification.error({
        title: 'Error',
        content: '反馈失败'
      })
    }
  }

  return (
    <>
      <div className={styles.box_styles_touchable} onClick={() => setVisible(true)}>
        <div className={styles.font_styles}>什么烂ai?我要反馈！</div>
      </div>

      <Modal
        title='反馈'
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        style={{ maxWidth: '425px' }}
      >
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <div className='w-full flex p-[10px] items-center justify-center text-[14px] gap-[10px]'>
            请详细描述您遇到的问题或者建议，我们将尽快处理。
          </div>
          <div className='flex w-full items-center space-x-2'>
            <Input
              value={inputText}
              onChange={value => setInputText(value)}
              className='flex-1 p-2 border rounded-md'
              placeholder='请输入你的问题...'
            />
            <Button
              onClick={handleSendFeedBack}
              className='text-white bg-blue-500 hover:bg-blue-600'
            >
              发送
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default HumanChat
