import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../../router/api.ts';
import style from '../Login/Login.module.css';
import { useAuth } from '../../context/AuthContext.tsx';
const Verify: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { email }=useAuth();
    const token = searchParams.get('token'); // 从 URL 获取 token
    console.log(email, token);

    const handleVerify = async () => {
        if (!password || !email || !token) {
        alert('缺少必要的信息，请检查链接或填写密码！');
        return;
        }

        try {
        await verifyEmail(email, token, password);
        setIsVerified(true);
        alert('邮箱激活成功！');
        navigate('/login'); // 跳转到登录页面
        } catch (error) {
        console.error('激活失败:', error);
        alert('激活失败，请稍后再试！');
        }
    };

    return (
        <>
        <div className={style.loginBox}>
            <h2 className={style.loginTitle}>Mundo 激活账户</h2>
            {isVerified ? (
                <p>激活成功！即将跳转到登录页面。</p>
            ) : (
                <>
                <div className={style.inputGroup}>
                    <label htmlFor="password">设置密码：</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                    />
                </div>
                <button className={style.loginBtn} onClick={handleVerify}>激活账户</button>
                </>
            )}
            <p className={style.registerLink}>已经有账号？<Link to="/login">去登录</Link></p>
        </div> 
        </>
    );
};

export default Verify;
