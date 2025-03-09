import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { sendResetEmail } from '../../router/api.ts';
import style from '../Login/Login.module.css';
import { useNavigate , Link } from 'react-router-dom';

const FindKey: React.FC = () => {
    const {setEmailFunc}=useAuth();
    const [inputEmail, setInputEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
  
    const handleRegister = async () => {
      if (!inputEmail) {
        alert('邮箱不能为空！');
        return;
      }
      try {
        console.log(inputEmail);
        await sendResetEmail(inputEmail,'register/verify/v1');
        setIsEmailSent(true);
        alert('验证邮件已发送，请查收邮箱完成验证！');
        setEmailFunc(inputEmail);

      } catch (error) {
        console.error('找回密码失败:', error);
        alert('找回密码失败，请稍后再试！');
      }
    };
  
    return (
        <>
        <div className={style.body}>

          <div className={style.loginBox}>
              <h2 className={style.loginTitle}>Mundo 找回密码</h2>
              {isEmailSent ? (
              <p>验证邮件已发送，请前往邮箱完成验证。</p>
              ) : (
                  <>
                      <div className={style.inputGroup}>
                          <label htmlFor="email">邮箱：</label>
                          <input
                          id="email"
                          type="email"
                          value={inputEmail}
                          onChange={(e) => setInputEmail(e.target.value)}
                          placeholder="请输入邮箱地址"
                          />
                      </div>
                      <button className={style.loginBtn} onClick={handleRegister}>发送验证邮件</button>

                  </>
              )}  
              <p className={style.registerLink}>想起密码？<Link to="/login">去登录</Link></p>
          </div>  
        </div>  
        
        </> 
      
    );
  };
export default FindKey;
