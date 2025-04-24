import { createSignal } from "solid-js";
import Welcome from "../components/Welcome";

function Home() {
  const [count, setCount] = createSignal(0);
  
  const increment = () => setCount(count() + 1);

  return (
    <div class="home">
      <h1>欢迎使用 YBM CLI 创建的 SolidJS 项目</h1>
      <p>这是一个使用 SolidJS 和 Vite 构建的项目</p>
      
      <div class="features">
        <h2>特性</h2>
        <ul>
          <li>SolidJS</li>
          <li>Vite</li>
          <li>SolidJS Router</li>
        </ul>
      </div>
      
      <div class="counter">
        <button onClick={increment}>
          点击计数: {count()}
        </button>
      </div>
      
      <Welcome message="开始你的开发之旅吧!" />
    </div>
  );
}

export default Home;
