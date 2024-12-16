import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from '@/pages/home/page.tsx';
// import DashboardPage from '@/components/Dashboard/Dashboardpage'; //后台
import Login from '@/pages/Login/Login'; // 登录
import RegisterPage from '@/pages/Register/Registerr'; // 注册
import BindRegisterPage from '@/pages/Register/BindRegister'; // 注册
import Verify from '@/pages/Register/Verify'; // 注册验证
import DataStation from '@/pages/DataStation';//资料站
import Forum from '@/pages/Forum';//论坛
import QAndA from '@/pages/QAndA';//答疑
import TeamUp from '@/pages/TeamUp';//组队
import Post from './components/center/post';

import FrontPage from '@/pages/FrontPage.tsx';//首页
import AnswerWindow from '@/components/CustomerService/AnswerWindow'; // 导入答案窗口组件

import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <AnswerWindow /> {/*客服组件*/}
                    <Routes>
                        <Route path="/" element={<FrontPage />} /> 
                        {/* <Route path="/dashboard" element={<DashboardPage />} />  */}
                        {/* <Route path="/" element={<Home />} /> */}
                        <Route path="/datastation" element={<DataStation />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/qanda" element={<QAndA />} />
                        <Route path="/center" element={<Post />}/>
                        <Route path="/teamup" element={<TeamUp />} />
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/bindregister" element={<BindRegisterPage />} />
                        <Route path="/register/verify/v2" element={<Verify />} />
                        {/* 可以根据实际需求继续添加更多的路由配置 */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;