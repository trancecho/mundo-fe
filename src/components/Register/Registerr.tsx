import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { registerUser } from '../../router/api';
import style from '../Login/Login.module.css';
import { useNavigate , Link } from 'react-router-dom';

const Registerr: React.FC = () => {
    const {setEmailFunc}=useAuth();
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
        console.log(inputEmail);
        await registerUser(inputEmail, inputEmail);
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
            <h2 className={style.loginTitle}>Mundo 注册</h2>
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
                    <Link to="/register/verify/v2">去yanzheng</Link>

                </>
            )}  
            <p className={style.registerLink}>已经有账号？<Link to="/login">去登录</Link></p>
        </div>  
        
        </> 
      
    );
  };
export default Registerr;
