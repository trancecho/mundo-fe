import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { registerUser } from "../../router/api.ts";
// import style from '../Login/Login.module.css';
import style from "@/pages/Login/Auth.module.css";
import { useNavigate, Link } from "react-router-dom";
import * as process from "node:process";
import Header from "@/components/Header/Header.tsx";

const Registerr: React.FC = () => {
  const { setEmailFunc } = useAuth();
  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async () => {
    //   if (!username || !email) {
    //     alert('用户名和邮箱不能为空！');
    //     return;
    //   }
    const callbackURL = import.meta.env.VITE_callbackURL;
    const callbackPath = "/register/verify/v2";
    const url = callbackURL + callbackPath;

    try {
      //console.log(inputEmail);
      // if (import.meta.env.VITE_mode === 'dev') {
      //     await registerUser(inputEmail, inputEmail, url);
      // } else {
      //     //console.log('registerUser-prod');
      // }
      await registerUser(inputEmail, inputEmail, url);
      setIsEmailSent(true);
      alert("验证邮件已发送，请查收邮箱完成验证！");
      setEmailFunc(inputEmail);
    } catch (error) {
      console.error("注册失败:", error);
      alert("注册失败，请稍后再试！");
    }
  };
  return (
    <div className={style.authContainer}>
      <div className={style.gradientBackground}></div>

      <div className={style.authCard}>
        <div className={style.authHeader}>
          <h1 className={style.authTitle}>
            加入<span>MUNDO</span>
          </h1>
          <p className={style.authSubtitle}>开启你的知识探索之旅</p>
        </div>

        <div className={style.authBody}>
          {isEmailSent ? (
            <div className={style.successState}>
              <div className={style.successIcon}>✓</div>
              <h2>验证邮件已发送</h2>
              <p>请检查 {inputEmail} 的收件箱完成验证</p>
              <button
                className={style.secondaryButton}
                onClick={() => navigate("/login")}
              >
                返回登录
              </button>
            </div>
          ) : (
            <div className={style.authMain}>
              <div className={style.inputGroup}>
                <input
                  title="邮箱"
                  type="email"
                  className={style.authInput}
                  placeholder=" "
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                <label className={style.inputLabel}>电子邮箱</label>
                <div className={style.inputUnderline}></div>
              </div>

              <button className={style.primaryButton} onClick={handleRegister}>
                <span>发送验证邮件</span>
                <div className={style.buttonHover}></div>
              </button>

              {/*<div className={style.authDivider}>*/}
              {/*    <span>或使用以下方式</span>*/}
              {/*</div>*/}

              {/*<div className={style.socialAuth}>*/}
              {/*    <button className={`${style.socialButton} ${style.wechat}`}>*/}
              {/*        <i className="icon-wechat"></i>*/}
              {/*        微信快速注册*/}
              {/*    </button>*/}
              {/*</div>*/}
            </div>
          )}

          <div className={style.authFooter}>
            <p className={style.legalNotice}>
              点击注册即表示同意我们的
              <Link to="/terms" className={style.legalLink}>
                服务条款
              </Link>
              和
              <Link to="/privacy" className={style.legalLink}>
                隐私政策
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registerr;
