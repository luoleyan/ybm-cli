<script>
  export let message = "欢迎使用 Svelte!";
</script>

<div class="welcome">
  <h3>{message}</h3>
  <div class="links">
    <a href="https://svelte.dev/" target="_blank">Svelte 官方文档</a>
    <a href="https://vitejs.dev/" target="_blank">Vite 官方文档</a>
    <a href="https://github.com/mefechoel/svelte-navigator" target="_blank">Svelte Navigator 文档</a>
  </div>
  <p class="read-the-docs">
    点击上方链接了解更多
  </p>
</div>

<style>
  .welcome {
    background-color: #ffece6;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 2rem;
  }
  
  h3 {
    color: #ff3e00;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .links a {
    padding: 0.5rem 1rem;
    background-color: #ff3e00;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .links a:hover {
    background-color: #e63600;
  }
  
  .read-the-docs {
    margin-top: 1.5rem;
    color: #888;
  }
</style>
