import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import './assets/App.css'

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">首页</Link>
          <Link to="/about">关于</Link>
        </nav>
      </header>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
