import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import EmbedRanking from './pages/EmbedRanking'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/embed/ranking/:eventId" element={<EmbedRanking />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
