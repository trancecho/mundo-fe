import React, { useState, useEffect } from 'react'
import { getFeedBack } from '@/router/api'

interface QuestionResponse {
  question: string
  answers: string
}
export interface FAQData {
  question: string
  answers: string
  id?: number
}

export default function FAQPage() {
  const [faqData, setFaqData] = useState<FAQData[]>([])

  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await getFeedBack()
      setFaqData(
        fetchedQuestions.map((q: QuestionResponse, index: number) => ({
          ...q,
          id: index + 1
        }))
      )
    } catch (error) {
      alert('问题列表访问失败')
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div className='bg-slate-800 rounded-lg p-6 h-[80vh] overflow-auto'>
      <h2 className='mb-6 text-xl font-semibold text-white'>FeedBack</h2>

      {faqData.map((item, index) => (
        <div key={item.id || index} className='p-4 mb-4 rounded-lg shadow bg-slate-700'>
          <p className='mb-2 text-left text-white'>{item.question}</p>
        </div>
      ))}
    </div>
  )
}
