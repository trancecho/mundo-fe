import React, { useState } from 'react';
import style from './Login.module.css'; 
import { loginUser } from '../../router/api'; // 导入登录函数
// import { useHistory } from 'react-router-dom'; // React Router 的 hook，确保在登录成功后跳转到其他页面
import { useNavigate,Link } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const Navigate = useNavigate();
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

//   const handleLogin = () => {
//     // Implement login logic here
//     console.log('Email:', email);
//     console.log('Password:', password);
//   };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await loginUser(email, password); // 调用登录函数
      console.log('登录成功:', data);
      Navigate('/qanda');
    } catch (err) {
      setError('登录失败，请检查您的电子邮件和密码');
    }
  };
  return (
    <div className={style.loginBox}>
        <h2 className={style.loginTitle}>Mundo 登录</h2>
        <div className={style.inputGroup}>
            <label htmlFor="email">邮箱：</label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="请输入邮箱"
            required
            />
        </div>
        <div className={style.inputGroup}>
            <label htmlFor="password">密码：</label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="请输入密码"
            required
            />
        </div>
        <button className={style.loginBtn} onClick={handleLogin}>登录</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className={style.otherLogin}>
            <button className={style.loginOption}>邮箱验证登录</button>
            <button className={style.loginOption}>手机号登录</button>
            <button className={style.loginOption}>微信登录</button>
        </div>
        <p className={style.registerLink}>还没有账号？<Link to="/register">去注册</Link></p>

    </div>
  );
};

export default Login;
