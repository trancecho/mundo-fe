import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { registerUser } from '../../router/api.ts';
import style from '../Login/Login.module.css';
import { useNavigate , Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const BindRegister: React.FC = () => {
    const {setEmailFunc}=useAuth();
    const location =useLocation();
    const {external}=location.state||{};
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
  
    const handleRegister = async () => {
    //   if (!username || !email) {
    //     alert('用户名和邮箱不能为空！');
    //     return;
    //   }
  
      try {
        console.log(inputEmail,external);
        await registerUser(inputEmail, inputEmail,'login',external);
        setIsEmailSent(true);
        alert('验证邮件已发送，请查收邮箱完成验证！');
        setEmailFunc(inputEmail);

      } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请稍后再试！');
      }
    };
  
    return (
        <>
        <div className={style.loginBox}>
            <h2 className={style.loginTitle}>Mundo 绑定邮箱</h2>
            {isEmailSent ? (
            <p>验证邮件已发送，请前往邮箱完成验证。</p>
            ) : (
                <>
                    {/* <div className={style.inputGroup}>
                        <label htmlFor="username">用户名：</label>
                        <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        />
                    </div> */}
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
            <p className={style.registerLink}>已经有账号？<Link to="/login">去登录</Link></p>
        </div>  
        
        </> 
      
    );
  };
export default BindRegister;
