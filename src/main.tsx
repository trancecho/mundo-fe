import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import Home from '@/pages/home/page.tsx'
import "@arco-design/web-react/dist/css/arco.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <Home/> */}
  </StrictMode>
)
