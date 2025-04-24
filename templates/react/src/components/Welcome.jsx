function Welcome({ message }) {
  return (
    <div className="welcome">
      <h3>{message}</h3>
      <div className="links">
        <a href="https://react.dev/" target="_blank">React 官方文档</a>
        <a href="https://vitejs.dev/" target="_blank">Vite 官方文档</a>
        <a href="https://reactrouter.com/" target="_blank">React Router 文档</a>
      </div>
      <p className="read-the-docs">
        点击上方链接了解更多
      </p>
    </div>
  )
}

export default Welcome
