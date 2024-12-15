import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from '@/pages/home/page.tsx';
import DashboardPage from '@/components/Dashboard/Dashboardpage'; // 这里替换为你实际的后台界面组件路径及名称
import Login from '@/pages/Login/Login'; // 这里替换为你实际的登录界面组件路径及名称
import RegisterPage from '@/pages/Register/Registerr'; // 导入Register组件
import Verify from '@/pages/Register/Verify'; // 导入Register组件
import DataStation from '@/pages/DataStation';
import Forum from '@/pages/Forum';
import QAndA from '@/pages/QAndA';
import TeamUp from '@/pages/TeamUp';
import AnswerWindow from '@/components/CustomerService/AnswerWindow'; // 导入答案窗口组件

import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <AnswerWindow /> {/*客服组件*/}
                    <Routes>
                        <Route path="/" element={<DashboardPage />} /> // 添加后台界面路由
                        {/* <Route path="/" element={<Home />} /> */}
                        <Route path="/datastation" element={<DataStation />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/qanda" element={<QAndA />} />
                        <Route path="/teamup" element={<TeamUp />} />
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