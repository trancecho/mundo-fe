import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { sendResetEmail } from '../../router/api.ts';
import style from './findKey.module.css';
import { useNavigate, Link } from 'react-router-dom';

const FindKey: React.FC = () => {
  const { setEmailFunc } = useAuth();
  const [inputEmail, setInputEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleRegister = async () => {
    if (!inputEmail) {
      alert('邮箱不能为空！');
      return;
    }
    const callbackURL = import.meta.env.VITE_callbackURL;
    const callbackPath = "/register/verify/v1";
    const url = callbackURL + callbackPath;
    try {
      //console.log(inputEmail);
      await sendResetEmail(inputEmail, url);
      setIsEmailSent(true);
      alert('验证邮件已发送，请查收邮箱完成验证！');
      setEmailFunc(inputEmail);

    } catch (error) {
      console.error('找回密码失败:', error);
      alert('找回密码失败，请稍后再试！');
    }
  };


  return (
    <div className={style.body}>
      <div className="specialBox mt-[10rem] flex justify-center items-center h-[18rem] w-[20rem]">
        <div className="flex flex-col rounded gap-2">

          <h2 className="authTitle mb-[10px]">Mundo 找回密码</h2>
          {isEmailSent ? (
            <p className="mt-[10px] text-normal text-xs text-white">验证邮件已发送，请前往邮箱完成验证。</p>
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
              <button className="specialButton" onClick={handleRegister}>发送验证邮件</button>

            </>
          )}
          <p className="mt-[10px] text-normal text-xs text-white">想起密码？<Link to="/login" className="text-normal text-xs text-white">去登录</Link></p>
        </div>
      </div>
    </div>
  )


};
export default FindKey;
