import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Post.css'

import { Spin, Empty, Card, Typography, Notification } from '@arco-design/web-react'
import { Post } from '@/interfaces/post'
const PostList = ({ data, loading }: { data: Post[]; loading: boolean }) => {
  const navigate = useNavigate()
  if (loading) return <Spin />
  if (data.length === 0) return <Empty description='暂无数据' />

  const handleMessageClick = (messageId: number) => {
    let longtoken = localStorage.getItem('longtoken')
    if (!longtoken) {
      Notification.info({
        closable: false,
        title: '请先登录',
        content: '请先登录后再进行操作。'
      })
      return
    }
    navigate(`/qanda/${messageId}`)
  }

  return (
    <div className='mobileTabs flex flex-col px-[16px]'>
      {data.map(message => (
        <>
          <div
            key={message.id}
            className='w-full py-[8px] flex gap-[1rem] border-b border-white/10'
            onClick={() => handleMessageClick(message.id)}
          >
            <div className='w-full flex flex-1 flex-col gap-[2px]'>
              <div className='flex flex-col gap-[5px]'>
                <div className='font-semibold text-[16px]  text-[--color-text-1] text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.title ? message.title : '无标题'}
                </div>
                <div className='font-medium text-[13px] leading-[22px] text-[--color-text-2] text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.content ? message.content : '无内容'}
                </div>
              </div>

              <div className='flex w-full justify-between gap-[10px]'>
                <div className='flex gap-[5px] text-[--color-text-3] whitespace-nowrap'>
                  <span className='text-[12px] font-base'>👁️ {message.view}</span>
                  <span className='text-[12px] font-base'>💬 {message.answer_count}</span>
                  {/* <span>🕒 {new Date(message.created_at).toLocaleDateString()}</span> */}
                </div>
                <div className='flex flex-1 gap-[5px] max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap justify-end'>
                  {message.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='flex items-center justify-center px-[6px] rounded-[4px] text-[--color-text-1] text-[12px] font-base bg-[#030329]'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {message.picture && message.picture.length > 0 && (
              <div className='flex w-[108px] h-[72px]'>
                <img
                  src={`data:image/jpeg;base64,${message.picture[0]}`}
                  alt='Message'
                  className='w-full h-full object-cover'
                  onError={() => {
                    console.error('图片加载失败:', message.picture[0])
                  }}
                />
              </div>
            )}
          </div>
        </>
      ))}
    </div>
  )
}
export default PostList
