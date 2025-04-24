import { Routes, Route, A } from '@solidjs/router'
import { createSignal } from 'solid-js'
import Home from './pages/Home'
import About from './pages/About'
import './App.css'

function App() {
  const [count, setCount] = createSignal<number>(0)

  return (
    <div class="App">
      <header class="header">
        <nav>
          <A href="/">Home</A> | <A href="/about">About</A>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" component={() => <Home count={count()} setCount={setCount} />} />
          <Route path="/about" component={About} />
        </Routes>
      </main>
    </div>
  )
}

export default App
