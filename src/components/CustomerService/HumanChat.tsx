import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import styles from "./AnswerWindow.module.css"
import { useChat } from "./useChat"

const HumanChat: React.FC = () => {
  const {
    messages,
    sendMessage,
    clearHistory,
    connectWebSocket,
    disconnectWebSocket
  } = useChat()
  const [inputText, setInputText] = useState<string>("")

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage(inputText)
      setInputText("")
    }
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) {
          connectWebSocket() // 用户打开对话框时建立 WebSocket 连接
        } else {
          disconnectWebSocket() // 关闭对话框时断开 WebSocket 连接
        }
      }}
    >
      <DialogTrigger asChild>
        <div className={styles.box_styles_touchable}>
          <div className={styles.font_styles}>什么烂ai?转人工！</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>人工客服</DialogTitle>
          <DialogDescription>
            你可以与我们亲切的客服人员进行实时对话。<br></br>（记得先登录哦～）
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          {/* 聊天区 */}
          <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } gap-2`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  <strong>
                    {message.sender === "user" ? "你: " : "客服: "}
                  </strong>
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 输入框和发送按钮 */}
        <div className="flex items-center space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="请输入你的问题..."
          />
          <Button
            onClick={handleSendMessage}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            发送
          </Button>
          <Button onClick={clearHistory} variant="destructive">
            删除聊天记录
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HumanChat
