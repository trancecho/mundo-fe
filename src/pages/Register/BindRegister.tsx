import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { registerUser } from "../../router/api.ts";
import style from "../Login/Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const BindRegister: React.FC = () => {
  const { setEmailFunc } = useAuth();
  const location = useLocation();
  const { external } = location.state || {};
  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleRegister = async () => {
    //   if (!username || !email) {
    //     alert('用户名和邮箱不能为空！');
    //     return;
    //   }
    const callbackURL = import.meta.env.VITE_callbackURL;
    const callbackPath = "/register/verify/v2";
    const url = callbackURL + callbackPath;
    try {
      //console.log(inputEmail, external);
      //
      const stuffid = localStorage.getItem("stuffid") as string;
      await registerUser(inputEmail, inputEmail, url, external, stuffid);
      setIsEmailSent(true);
      alert("验证邮件已发送，请查收邮箱完成验证！");
      setEmailFunc(inputEmail);
    } catch (error) {
      console.error("注册失败:", error);
      alert("注册失败，请稍后再试！");
    }
  };

  return (
    <>
      <div className={style.body}>
        {/* <div className={style.loginBox}> */}
        <div className="specialBox mt-[2rem] flex justify-center items-center h-[20rem] w-[24rem]">
          <div className="flex flex-col rounded gap-2">
            <h2 className="authTitle mb-[10px]">Mundo 绑定邮箱</h2>
            {isEmailSent ? (
              <p className="text-normal text-base text-white">
                验证邮件已发送，请前往邮箱完成验证。
              </p>
            ) : (
              <>
                <div className={style.inputGroup}>
                  <p className="text-normal text-base text-white">邮箱：</p>

                  <input
                    id="email"
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <button className="specialButton" onClick={handleRegister}>
                  发送验证邮件
                </button>
              </>
            )}
            <p className="mt-[10px] text-normal text-xs text-white">
              已经有账号？
              <Link to="/login" className="text-normal text-xs text-white">
                去登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default BindRegister;
