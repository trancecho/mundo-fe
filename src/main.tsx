import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import Home from '@/pages/home/page.tsx'
import '@arco-design/web-react/dist/css/arco.css'
import { HoutaiAuthProvider } from '@/context/HoutaiAuthContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const quertClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={quertClient}>
    <StrictMode>
      <HoutaiAuthProvider>
        <App />
      </HoutaiAuthProvider>
    </StrictMode>
  </QueryClientProvider>
)
