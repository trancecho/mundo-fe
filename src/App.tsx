import React, { useEffect } from 'react' // ✅ 修改点：添加 useEffect
import { AuthProvider } from './context/AuthContext'
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate // ✅ 修改点：添加 useLocation 和 useNavigate
} from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app' // ✅ 修改点：引入 Capacitor App 插件

// 页面组件
import Login from '@/pages/Login/Login'
import RegisterPage from '@/pages/Register/Registerr'
import BindRegisterPage from '@/pages/Register/BindRegister'
import Reset from '@/pages/Register/Reset'
import DataStation from '@/pages/DataStation'
import PostListView from '@/pages/QAndA/PostListView.tsx'
import TeamUp from '@/pages/TeamUp'
import Houtai from './pages/Houtai/Houtai'
import CreatorCenter from '@/pages/center/CreatorCenter'
import FrontPage from '@/pages/FrontPage/FrontPage'
import AnswerWindow from '@/components/CustomerService/AnswerWindow'
import DetailMessage from './pages/QAndA/DetailMessage'
import Review from '@/pages/Review/Review'
import Timerme from '@/pages/Timerme/Timerme'
import MultiPersonChat from '@/pages/Houtai/BackstageChat/MultiPersonChat.tsx'
import FAQ from '@/pages/Houtai/FAQ/FAQPage'
import Check from '@/pages/Houtai/Check/Check'
import DashboardFrontpage from './pages/Houtai/DashboardFrontpage'
import ItemList from '@/pages/DataStation/ItemList'
import FileManager from '@/pages/FileManager/page'
import FindKey from '@/pages/FindKey/FindKey'
import './App.css'
import InfoManage from '@/pages/Info/page.tsx'
import EmailVerification from '@/pages/Register/EmailVerification.tsx'
import { SearchProvider } from './components/Header/SearchContext.tsx'
import HoutaiLogin from './pages/Houtai/HoutaiLogin.tsx'
import HoutaiRequireAuth from './components/HoutaiRequireAuth'
import FeedBack from '@/pages/Houtai/FeedBack.tsx'
import MainLayout from './layouts/MainLayouts.tsx'

/**
 * ✅ 修改点：我们把原来的 <Routes> 部分单独封装为 AppRoutes，并加上返回键监听
 */
const AppRoutes: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    CapacitorApp.addListener('backButton', () => {
      if (location.pathname !== '/') {
        navigate(-1)
      } else {
        CapacitorApp.exitApp()
      }
    })

    return () => {
      CapacitorApp.removeAllListeners()
    }
  }, [location, navigate])

  return (
    <>
      <AnswerWindow />
      <Routes>
        <Route path='/' element={<FrontPage />} />
        <Route
          path='/datastation'
          element={
            <MainLayout>
              <DataStation />
            </MainLayout>
          }
        >
          <Route path='' element={<Navigate to='math1' replace />} />
          <Route path='math1' element={<ItemList category='高数上' />} />
          <Route path='math2' element={<ItemList category='高数下' />} />
          <Route path='physics1' element={<ItemList category='大物上' />} />
          <Route path='physics2' element={<ItemList category='大物下' />} />
          <Route path='c-language' element={<ItemList category='C语言' />} />
          <Route path='others' element={<ItemList category='其他' />} />
        </Route>
        <Route
          path='/qanda'
          element={
            <MainLayout>
              <PostListView />
            </MainLayout>
          }
        />
        <Route
          path='/qanda/:id'
          element={
            <MainLayout>
              <DetailMessage />
            </MainLayout>
          }
        />
        <Route
          path='/center'
          element={
            <MainLayout>
              <CreatorCenter />
            </MainLayout>
          }
        />
        <Route
          path='/teamup'
          element={
            <MainLayout>
              <TeamUp />
            </MainLayout>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/bindregister' element={<BindRegisterPage />} />
        <Route path='/register/verify/v2' element={<EmailVerification />} />
        <Route path='/register/verify/v1' element={<Reset />} />
        <Route path='/review' element={<Review />} />
        <Route
          path='/info'
          element={
            <MainLayout>
              <InfoManage />
            </MainLayout>
          }
        />
        <Route path='/findKey' element={<FindKey />} />
        <Route path='/houtaiLogin' element={<HoutaiLogin />} />
        <Route
          path='/houtai'
          element={
            <HoutaiRequireAuth>
              <Houtai />
            </HoutaiRequireAuth>
          }
        >
          <Route path='' element={<DashboardFrontpage />} />
          <Route path='multiPersonChat' element={<MultiPersonChat />} />
          <Route path='faq' element={<FAQ />} />
          <Route path='check' element={<Check />} />
          <Route path='dashboardfrontpage' element={<DashboardFrontpage />} />
          <Route path='feedback' element={<FeedBack />} />
        </Route>
      </Routes>
    </>
  )
}

/**
 * ✅ 修改点：将 AppRoutes 嵌入到 Router 中
 */
const App: React.FC = () => {
  return (
    <SearchProvider>
      <AuthProvider>
        <Router>
          <AppRoutes /> {/* ✅ 修改点：原本在这里直接写 Routes，现在改为封装后的组件 */}
        </Router>
      </AuthProvider>
    </SearchProvider>
  )
}

export default App
