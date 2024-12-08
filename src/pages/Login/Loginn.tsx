import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
    // 明确username和password的类型为string
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 模拟登录请求
        try {
            if (username === 'admin' && password === 'admin') {
                navigate('/');
            } else {
                setError('用户名或密码错误');
            }
        } catch (err) {
            setError('登录失败，请稍后再试');
        }
    };

    return (
        <div className="login - page">
            <h2>登录</h2>
            <form onSubmit={handleLogin}>
                <div className="form - group">
                    <label>用户名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form - group">
                    <label>密码</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error - message">{error}</p>}
                <button type="submit">登录</button>
            </form>
            <p>还没有账号？<Link to="/register">去注册</Link></p>
        </div>
    );
};

export default LoginPage;