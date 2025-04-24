import { useState } from 'react'
import Welcome from '../components/Welcome'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="home">
      <h1>欢迎使用 YBM CLI 创建的 React 项目</h1>
      <p>这是一个使用 React 和 Vite 构建的项目</p>
      
      <div className="features">
        <h2>特性</h2>
        <ul>
          <li>React</li>
          <li>Vite</li>
          <li>React Router</li>
        </ul>
      </div>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          点击计数: {count}
        </button>
      </div>
      
      <Welcome message="开始你的开发之旅吧!" />
    </div>
  )
}

export default Home
