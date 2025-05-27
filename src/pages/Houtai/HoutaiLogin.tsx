import React from "react"
import { useState } from "react";
import { useAuth } from "@/context/HoutaiAuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import style from "@/pages/Login/Auth.module.css";
import { loginManager } from "@/router/api";
import { Message } from "@arco-design/web-react";
const HoutaiLogin: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/houtai"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password)
    if (success) {
      navigate("/houtai")
    }
  };

  return (
    <>
      <div className={style.authContainer}>
        <div className={style.gradientBackground}></div>
        <div className={style.authCard}>
          <div className={style.authHeader}>
            <h1 className={style.authTitle}>
              Welcome to <span>MUNDO的后台</span>
            </h1>
            <p className={style.authSubtitle}>
              连接全球求知者 · 构建智慧共同体
            </p>
          </div>

          <div className={style.authBody}>
            <div className={style.authMain}>
              <div className={style.inputGroup}>
                <input
                  title="email"
                  type="email"
                  className={style.authInput}
                  placeholder=" "
                  value={email}
                  onChange={handleEmailChange}
                />
                <label className={style.inputLabel}>电子邮箱</label>
                <div className={style.inputUnderline}></div>
              </div>

              <div className={style.inputGroup}>
                <input
                  title="password"
                  type="password"
                  className={style.authInput}
                  placeholder=" "
                  value={password}
                  onChange={handlePasswordChange}
                />
                <label className={style.inputLabel}>登录密码</label>
                <div className={style.inputUnderline}></div>
              </div>

              <button className={style.primaryButton} onClick={handleLogin}>
                <span>立即登录</span>
                <div className={style.buttonHover}></div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default HoutaiLogin
