import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';   
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from '@/pages/home/page.tsx';
import DashboardPage from '@/components/Dashboard/Dashboardpage'; // 这里替换为你实际的后台界面组件路径及名称
import Login from '@/components/Login/Login'; // 这里替换为你实际的登录界面组件路径及名称
import RegisterPage from '@/components/Register/Registerr'; // 导入Register组件
import Verify from '@/components/Register/Verify'; // 导入Register组件
import CustomerServiceButton from '@/components/CustomerService/CustomerServiceButton'; // 导入按钮组件
import AnswerWindow from '@/components/CustomerService/AnswerWindow'; // 导入答案窗口组件
import './App.css';

const App: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleWindow = () => {
        setIsOpen((prev) => !prev); // 切换客服答案窗口的显示和隐藏
    };
    return (
        <AuthProvider>
            <Router>
                <div>
                    <CustomerServiceButton onClick={toggleWindow} />
                    {isOpen && <AnswerWindow />}
                    <Routes>
                        <Route path="/" element={<DashboardPage />} /> // 添加后台界面路由
                        {/* <Route path="/" element={<Home />} /> */}

                        <Route path="/login" element={<Login />} /> // 添加登录界面路由
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/register/verify/v2" element={<Verify />} />
                        {/* 可以根据实际需求继续添加更多的路由配置 */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;