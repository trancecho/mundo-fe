import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import styles from "./AnswerWindow.module.css"
import { Notification } from '@arco-design/web-react';
import { createFeedBack } from "@/router/api"
const HumanChat: React.FC = () => {
  const [inputText, setInputText] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false);
  const handleSendFeedBack = async () => {
    try {
      await createFeedBack(inputText);
      Notification.success({
        title: 'Success',
        content: '反馈成功！！'
      })
      setOpen(false);
    }
    catch {
      Notification.error({
        title: 'Error',
        content: '反馈失败'
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={styles.box_styles_touchable}>
          <div className={styles.font_styles}>什么烂ai?我要反馈！</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>反馈</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="请输入你的问题..."
          />
          <Button
            onClick={handleSendFeedBack}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            发送
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HumanChat
