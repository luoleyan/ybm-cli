<script>
  import Welcome from "../components/Welcome.svelte";
  import { onMount } from "svelte";
  
  let count = 0;
  
  function increment() {
    count += 1;
  }
  
  onMount(() => {
    console.log("Home component mounted");
  });
</script>

<div class="home">
  <h1>欢迎使用 YBM CLI 创建的 Svelte 项目</h1>
  <p>这是一个使用 Svelte 和 Vite 构建的项目</p>
  
  <div class="features">
    <h2>特性</h2>
    <ul>
      <li>Svelte</li>
      <li>Vite</li>
      <li>Svelte Navigator</li>
    </ul>
  </div>
  
  <div class="counter">
    <button on:click={increment}>
      点击计数: {count}
    </button>
  </div>
  
  <Welcome message="开始你的开发之旅吧!" />
</div>

<style>
  .home {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  h1 {
    color: #ff3e00;
    font-size: 2.5em;
    margin-bottom: 0.5em;
  }
  
  .features {
    margin: 2rem 0;
  }
  
  .features ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .features li {
    padding: 0.5rem 1rem;
    background-color: #ffece6;
    border-radius: 4px;
    color: #ff3e00;
    font-weight: bold;
  }
  
  .counter {
    margin: 2rem 0;
  }
  
  button {
    background-color: #ff3e00;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #e63600;
  }
</style>
