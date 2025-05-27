import React, { useState, useEffect } from "react"
import gsap from "gsap"
import styles from "./AnswerWindow.module.css"
import { getQuestions } from "@/router/api"

interface Content {
  question: string
  answers: string
}

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<Content[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await getQuestions()
      //console.log("问题列表访问成功");
      setQuestions(fetchedQuestions)
    } catch (error) {
      alert("问题列表访问失败")
      console.error("Failed to fetch questions", error)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question === selectedQuestion ? null : question)
  }

  useEffect(() => {
    if (selectedQuestion !== null) {
      const answerElement = document.getElementById(
        `answer-${selectedQuestion}`
      )
      if (answerElement) {
        gsap.to(answerElement, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "expo.out"
        })
      }
    }
  }, [selectedQuestion])

  return (
    <section>
      <ul>
        {questions.map((question) => (
          <li
            key={question.question}
            onClick={() => handleQuestionClick(question.question)}
            className="my-1"
          >
            <article className={styles.box_styles_touchable}>
              <h3 className={styles.font_styles}>{question.question}</h3>
              <div
                id={`answer-${question.question}`}
                style={{
                  overflow: "hidden",
                  maxHeight:
                    selectedQuestion === question.question ? "1000px" : "0",
                  opacity: selectedQuestion === question.question ? 1 : 0,
                  transition: "opacity 0.3s ease-out"
                }}
              >
                <p className={styles.font_styles}>{question.answers}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default QuestionList
