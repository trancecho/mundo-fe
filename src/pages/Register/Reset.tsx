import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ResetKey } from '../../router/api.ts';
import style from '../Login/Login.module.css';
const Reset: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email= searchParams.get('email'); // 从 URL 获取 email
    const token = searchParams.get('token'); // 从 URL 获取 token
    console.log(email, token);

    const handleVerify = async () => {
        if (!password || !email || !token) {
        alert('缺少必要的信息，请检查链接或填写密码！');
        return;
        }

        try {
        await ResetKey(email, token, password);
        setIsVerified(true);
        alert('密码重置成功！');
        navigate('/login'); // 跳转到登录页面
        } catch (error) {
        console.error('重置失败:', error);
        alert('重置失败，请稍后再试！');
        }
    };

    return (
        <>
        <div className={style.body}>

            <div className={style.loginBox}>
                <h2 className={style.loginTitle}>Mundo 激活账户</h2>
                {isVerified ? (
                    <p>重置成功！即将跳转到登录页面。</p>
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
                    <button className={style.loginBtn} onClick={handleVerify}>重置密码</button>
                    </>
                )}
                <p className={style.registerLink}>无需重置？<Link to="/login">去登录</Link></p>
            </div> 
        </div> 
        </>
    );
};

export default Reset;
