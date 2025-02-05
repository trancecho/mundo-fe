import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from '@/pages/Login/Login'; // 登录
import RegisterPage from '@/pages/Register/Registerr'; // 注册
import BindRegisterPage from '@/pages/Register/BindRegister'; // 注册
import Verify from '@/pages/Register/Verify'; // 注册验证
import DataStation from '@/pages/DataStation';//资料站
import Forum from '@/pages/Forum';//论坛
import QAndA from '@/pages/QAndA/QAndA';//答疑
import TeamUp from '@/pages/TeamUp';//组队
import Houtai from './pages/Houtai/Houtai'; // 引入 Houtai.tsx
import Post from '@/pages/center/post';//发布帖子
import FrontPage from '@/pages/FrontPage/FrontPage';//首页
import AnswerWindow from '@/components/CustomerService/AnswerWindow'; // 导入答案窗口组件
import DetailMessage from './pages/QAndA/DetailMessage';//帖子详情页
import Review from '@/pages/Review/Review'; // 审核
import Timerme from '@/pages/Timerme/Timerme'; // 计时器
import MultiPersonChat from '@/pages/Houtai/BackstageChat/MultiPersonChat.tsx';
import FAQ from '@/pages/Houtai/FAQ/FAQPage';
import Check from '@/pages/Houtai/Check/Check';
import DashboardFrontpage from './pages/Houtai/DashboardFrontpage';
import ItemList from '@/pages/DataStation/ItemList';
import FileManager from '@/pages/FileManager/page';
import './App.css';


const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                    <AnswerWindow/> {/*客服组件*/}
                    <Routes>
                        <Route path="/" element={<FrontPage/>}/>
                        <Route path="/datastation" element={<DataStation/>}>
                            <Route path="" element={<Navigate to="math" replace />} />
                            <Route path="math" element={<ItemList category="高数" />} />
                            <Route path="physics" element={<ItemList category="大物" />} />
                            <Route path="c-language" element={<ItemList category="C语言" />} />
                            <Route path="others" element={<ItemList category="其他" />} />
                        </Route>
                        <Route path="/forum" element={<Forum/>}/>
                        <Route path="/qanda" element={<QAndA/>}/>
                        <Route path="/qanda/:id" element={<DetailMessage/>}/>
                        <Route path="/center" element={<Post/>}/>
                        <Route path="/teamup" element={<TeamUp/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/bindregister" element={<BindRegisterPage/>}/>
                        <Route path="/register/verify/v2" element={<Verify/>}/>
                        <Route path="/review" element={<Review/>}/>
                        <Route path="/filemanager" element={<FileManager/>}/>
                        {/*<Route path="/timerme" element={<Timerme/>}/>*/}
                        <Route path="/timerme" element={<FileManager/>}/>
                        <Route path="/houtai" element={<Houtai/>}>
                            <Route path="" element={<DashboardFrontpage/>}/>

                            <Route path="multiPersonChat" element={<MultiPersonChat/>}/>
                            <Route path="faq" element={<FAQ/>}/>
                            <Route path="check" element={<Check/>}/>
                            <Route path="dashboardfrontpage" element={<DashboardFrontpage/>}/>
                        </Route>
                    </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
