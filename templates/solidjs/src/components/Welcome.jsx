function Welcome(props) {
  return (
    <div class="welcome">
      <h3>{props.message}</h3>
      <div class="links">
        <a href="https://www.solidjs.com/" target="_blank">SolidJS 官方文档</a>
        <a href="https://vitejs.dev/" target="_blank">Vite 官方文档</a>
        <a href="https://github.com/solidjs/solid-router" target="_blank">SolidJS Router 文档</a>
      </div>
      <p class="read-the-docs">
        点击上方链接了解更多
      </p>
    </div>
  );
}

export default Welcome;
