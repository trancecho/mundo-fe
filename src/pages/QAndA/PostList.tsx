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
    <div className='flex flex-col px-[2rem]'>
      {data.map(message => (
        <>
          <div
            key={message.id}
            className='w-full h-[100px] px-[20px] py-[8px] flex gap-[1rem] border-b border-white/10'
            onClick={() => handleMessageClick(message.id)}
          >
            <div className='w-[80%] flex flex-col gap-[10px]'>
              <div className='flex flex-col gap-[6px]'>
                <div className='font-semibold text-[18px]  text-[--color-text-1] text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.title ? message.title : '无标题'}
                </div>
                <div className='font-bold text-[15px] leading-[22px] text-[--color-text-2] text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.content ? message.content : '无内容'}
                </div>
              </div>

              <div className='flex w-full justify-between'>
                <div className='flex gap-[20px] text-[--color-text-3]'>
                  <span className='text-[12px] font-base'>👁️ {message.view} 浏览</span>
                  <span className='text-[12px] font-base'>
                    💬 {message.answer_count} 回复
                  </span>
                  {/* <span>🕒 {new Date(message.created_at).toLocaleDateString()}</span> */}
                </div>
                <div className='flex gap-[5px] max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap'>
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
            <div className='flex w-[20%] h-full'>
              {message.picture && message.picture.length > 0 && (
                <img
                  src={`data:image/jpeg;base64,${message.picture[0]}`}
                  alt='Message'
                  className='w-full h-full object-cover'
                  onError={() => {
                    console.error('图片加载失败:', message.picture[0])
                  }}
                />
              )}
            </div>
          </div>
        </>
      ))}
    </div>
  )
}
export default PostList
