import React, { useState, useEffect } from "react";
import gsap from "gsap";
import styles from "./AnswerWindow.module.css";
import axios from "axios";

interface Content {
  question: string;
  answers: string;
}

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<Content[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const url = "http://127.0.0.1:4523/m1/4936698-4594190-default/api/faq/read";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJ1c2VybmFtZSI6ImphY2siLCJyb2xlIjoidXNlciIsImlzcyI6Im11bmRvLWF1dGgtaHViIiwiZXhwIjoxNzM0OTQ4NDM3LCJpYXQiOjE3MzQzNDM2Mzd9.LUH6mXKHFveAqpWSRy8blYTbV1H4k2h7nNf6Ax20g78";
  
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const fetchedQuestions = response.data.data.message.Content;
      setQuestions(fetchedQuestions);
    } catch (error) {
      alert("问题列表访问失败");
      console.error("Failed to fetch questions", error);
    }
  };

  const createQuestion = async (question: string, answer: string) => {
    try {
      console.log("Sending create request with data:", { question, answer });
      const response = await axios.post(
        "http://127.0.0.1:4523/m1/4936698-4594190-default/api/faq/create",
        {
          question,
          answer,
        }
      );
      if (response.data.code === 200) {
        setQuestions([...questions, { question, answers: answer }]);
        setNewQuestion("");
        setNewAnswer("");
        alert("问题创建成功");
      }
    } catch (error) {
      console.error("Failed to create question", error);
      alert("创建问题失败");
    }
  };

  const updateQuestion = async (
    question: string,
    newQuestion: string,
    newAnswer: string
  ) => {
    try {
      const response = await axios.post(
        "http://116.198.207.159:12349/faq/read",
        {
          question,
          newQuestion,
          newAnswer,
        }
      );
      if (response.data.code === 200) {
        const updatedQuestions = questions.map((q) =>
          q.question === question
            ? { ...q, question: newQuestion, answers: newAnswer }
            : q
        );
        setQuestions(updatedQuestions);
        alert("问题更新成功");
      } else if (response.data.code === 400) {
        if (response.data.message === "问题已存在") {
          alert("新问题已经存在，请选择其他问题名");
        } else if (response.data.message === "问题不存在") {
          alert("原问题不存在");
        }
      }
    } catch (error) {
      console.error("Failed to create question", error);
      alert("更新问题失败");
    }
  };

  const deleteQuestion = async (question: string) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:4523/m1/4936698-4594190-default/api/faq/delete",
        {
          question,
        }
      );
      if (response.data.code === 200) {
        const updatedQuestions = questions.filter(
          (q) => q.question !== question
        );
        setQuestions(updatedQuestions);
        alert("问题删除成功");
      } else if (response.data.code === 400) {
        if (response.data.message === "问题不存在") {
          alert("问题不存在");
        }
      }
    } catch (error) {
      console.error("Failed to create question", error);
      alert("删除问题失败");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question === selectedQuestion ? null : question);
  };

  useEffect(() => {
    if (selectedQuestion !== null) {
      const answerElement = document.getElementById(
        `answer-${selectedQuestion}`
      );
      if (answerElement) {
        gsap.to(answerElement, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "expo.out",
        });
      }
    }
  }, [selectedQuestion]);

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
                  transition: "opacity 0.3s ease-out",
                }}
              >
                <p className={styles.font_styles}>{question.answers}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {/* <form className="my-1">
        <input
          type="text"
          placeholder="问题"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="mr-1 bg-gray-200 rounded-lg p-1 py-2"
        />
        <input
          type="text"
          placeholder="答案"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="mr-1 bg-gray-200 rounded-lg p-1"
        />
        <button type="button" onClick={() => createQuestion(newQuestion, newAnswer)}>
          创建问题
        </button>
      </form>
      <form className="my-1">
        <input
          type="text"
          placeholder="原问题"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="新问题"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button type="button" onClick={() => updateQuestion(newQuestion, newQuestion, newAnswer)}>
          更新问题
        </button>
      </form>
      <form className="my-1">
        <input
          type="text"
          placeholder="问题"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button type="button" onClick={() => deleteQuestion(newQuestion)}>删除问题</button>
      </form> */}
    </section>
  );
};

export default QuestionList;
