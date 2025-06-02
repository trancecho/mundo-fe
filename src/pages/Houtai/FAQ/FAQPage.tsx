import React, { useState, useEffect } from 'react'
import styles from '../Houtai.module.css' // 引入CSS模块
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '@/router/api'
interface QuestionResponse {
  question: string
  answers: string
}
export interface FAQData {
  question: string
  answers: string
  isEditing: boolean
  id?: number
}

export default function FAQPage() {
  const [faqData, setFaqData] = useState<FAQData[]>([]) // 本地状态保存问题列表
  const [editableData, setEditableData] = useState<FAQData | null>(null) // 本地状态保存当前编辑的数据

  // 添加功能
  const handleAdd = () => {
    setFaqData(prev => [...prev, { question: '', answers: '', isEditing: true }])
  }

  // 编辑功能
  const handleEdit = (index: number) => {
    const item = faqData[index]
    setEditableData(item)
    setFaqData(prev =>
      prev.map((item, i) => (i === index ? { ...item, isEditing: true } : item))
    )
  }

  // 保存功能
  const handleSave = async (
    index: number,
    updatedQuestion: string,
    updatedAnswer: string
  ) => {
    try {
      const item = faqData[index]
      if (!item.id) {
        // 新问题
        await createQuestion(updatedQuestion, updatedAnswer)
        setFaqData(prev =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  question: updatedQuestion,
                  answers: updatedAnswer,
                  isEditing: false
                }
              : item
          )
        )
      } else {
        // 更新问题
        await updateQuestion(editableData.question, updatedQuestion, updatedAnswer)
        setFaqData(prev =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  question: updatedQuestion,
                  answers: updatedAnswer,
                  isEditing: false
                }
              : item
          )
        )
      }
    } catch (error) {
      console.error('Failed to save question', error)
    }
    setEditableData(null)
  }

  // 删除功能
  const handleDelete = async (index: number) => {
    try {
      const item = faqData[index]
      await deleteQuestion(item.question)
      setFaqData(prev => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Failed to delete question', error)
    }
  }

  // 问题列表
  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await getQuestions()
      //console.log("问题列表访问成功");
      setFaqData(
        fetchedQuestions.map((q: QuestionResponse[], index: number) => ({
          ...q,
          id: index + 1,
          isEditing: false
        }))
      )
    } catch (error) {
      alert('问题列表访问失败')
      console.error('Failed to fetch questions', error)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div className='bg-slate-800 rounded-lg p-6 h-[80vh] overflow-auto'>
      <h2 className='mb-6 text-xl font-semibold text-white'>
        FAQ（更新问题时不能只改答案）
      </h2>
      <button
        onClick={handleAdd}
        className='px-4 py-2 mb-6 text-white transition-colors rounded-md bg-slate-600 hover:bg-slate-700'
      >
        添加问题
      </button>

      {faqData.map((item, index) =>
        item.isEditing ? (
          <div key={item.id || index} className='p-4 mb-4 rounded-lg shadow bg-slate-700'>
            <div className='mb-3'>
              <label className='block mb-1 text-white'>问题: </label>
              <input
                type='text'
                value={item.question}
                className='w-full p-2 text-white border rounded-md bg-slate-800 border-slate-600'
                onChange={e => {
                  const updatedQuestion = e.target.value
                  setFaqData(prev =>
                    prev.map((q, i) =>
                      i === index ? { ...q, question: updatedQuestion } : q
                    )
                  )
                }}
              />
            </div>
            <div className='mb-3'>
              <label className='block mb-1 text-white'>回答: </label>
              <input
                type='text'
                value={item.answers}
                className='w-full p-2 text-left text-white border rounded-md bg-slate-800 border-slate-600'
                onChange={e => {
                  const updatedAnswer = e.target.value
                  setFaqData(prev =>
                    prev.map((q, i) =>
                      i === index ? { ...q, answers: updatedAnswer } : q
                    )
                  )
                }}
              />
            </div>
            <button
              onClick={() => handleSave(index, item.question, item.answers)}
              className='px-4 py-2 text-white transition-colors rounded-md bg-slate-900 hover:bg-slate-800'
            >
              保存
            </button>
          </div>
        ) : (
          <div key={item.id || index} className='p-4 mb-4 rounded-lg shadow bg-slate-700'>
            <p className='mb-2 text-left text-white'>
              <span className='font-medium'>问题:</span> {item.question}
            </p>
            <p className='mb-4 text-left text-slate-300'>
              <span className='font-medium text-white'>回答:</span> {item.answers}
            </p>
            <div className='flex justify-between'>
              <button
                onClick={() => handleEdit(index)}
                className='px-3 py-1 text-white transition-colors rounded-md bg-slate-600 hover:bg-slate-500'
              >
                更新问题
              </button>
              <button
                onClick={() => handleDelete(index)}
                className='px-3 py-1 text-white transition-colors bg-red-700 rounded-md hover:bg-red-600'
              >
                删除
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
