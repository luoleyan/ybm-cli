import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home count={count} setCount={setCount} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
