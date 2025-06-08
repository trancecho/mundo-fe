import React, { useRef, useEffect } from 'react'
import Style from './MobileDetailMessage.module.css'

interface RichInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export default function RichInput({ value, onChange, maxLength = 200 }: RichInputProps) {
  const editableDivRef = useRef<HTMLDivElement>(null)

  // 每当父组件的 value 变化，手动同步到 div
  useEffect(() => {
    const el = editableDivRef.current
    if (el && el.innerText !== value) {
      el.innerText = value
      moveCaretToEnd(el)
    }
  }, [value])

  // 工具函数：将光标移到末尾
  const moveCaretToEnd = (el: HTMLElement | null) => {
    if (!el) return
    const range = document.createRange()
    const sel = window.getSelection()
    if (!sel) return
    range.selectNodeContents(el)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    let text = e.currentTarget.innerText
    if (text.length > maxLength) {
      text = text.slice(0, maxLength)
      e.currentTarget.innerText = text
      moveCaretToEnd(e.currentTarget)
    }
    onChange(text)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    let pasted = e.clipboardData.getData('text').slice(0, maxLength)
    document.execCommand('insertText', false, pasted)
  }

  return (
    <div
      ref={editableDivRef}
      className={Style.richinput}
      contentEditable
      data-placeholder='平等表达，友善交流'
      onInput={handleInput}
      onPaste={handlePaste}
    ></div>
  )
}
