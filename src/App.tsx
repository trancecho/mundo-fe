// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from '@/pages/home/page.tsx';
import DashboardPage from '@/components/Dashboard/Dashboardpage'; // 这里替换为你实际的后台界面组件路径及名称
import LoginPage from '@/components/Login/Login'; // 这里替换为你实际的登录界面组件路径及名称
import RegisterPage from '@/components/Register/Register'; // 导入Register组件
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<DashboardPage />} /> // 添加后台界面路由
                {/* <Route path="/" element={<Home />} /> */}
                
                <Route path="/login" element={<LoginPage />} /> // 添加登录界面路由
                <Route path="/register" element={<RegisterPage />} />
                {/* 可以根据实际需求继续添加更多的路由配置 */}
            </Routes>
        </Router>
    );
}

export default App;