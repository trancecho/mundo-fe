import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
    // 为各个状态添加明确的类型声明
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    // 处理注册提交
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 验证密码和确认密码是否一致
        if (password!== confirmPassword) {
            setError('密码不一致');
            return;
        }

        try {
            // 发起注册请求（替换为实际 API）
            const response = await axios.post('/api/register', { username, password });

            // 假设 API 返回数据包含 success 字段，这里明确 response.data 的类型（示例中假设其为一个包含 success 属性的对象，类型可根据实际情况调整）
            type RegisterResponse = {
                success: boolean;
            };
            const data: RegisterResponse = response.data;

            if (data.success) {
                // 注册成功后跳转到登录页面
                navigate('/login');
            } else {
                setError('注册失败，请稍后再试');
            }
        } catch (err) {
            setError('注册失败，请稍后再试');
        }
    };

    return (
        <div className="register-page">
            <h2>注册</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>用户名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>密码</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>确认密码</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">注册</button>
            </form>
            <p>已有账号？<a href="/login">去登录</a></p>
        </div>
    );
};

export default RegisterPage;