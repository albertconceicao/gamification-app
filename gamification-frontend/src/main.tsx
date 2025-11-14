import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import EmbedRanking from './pages/EmbedRanking'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoutes from './components/ProtectedRoutes'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<App />} />
            <Route path="/embed/ranking/:eventId" element={<EmbedRanking />} />
            
            {/* 404 route - redirect to home if authenticated, or signin if not */}
            <Route path="*" element={<App />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
