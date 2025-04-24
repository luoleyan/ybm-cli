import { Routes, Route, A } from "@solidjs/router";
import Home from './pages/Home';
import About from './pages/About';
import './assets/App.css';

function App() {
  return (
    <div class="app">
      <header>
        <nav>
          <A href="/" end>首页</A>
          <A href="/about">关于</A>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
