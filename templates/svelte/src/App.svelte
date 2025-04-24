<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
</script>

<Router>
  <nav>
    <Link to="/">首页</Link>
    <Link to="/about">关于</Link>
  </nav>

  <div class="content">
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
  </div>
</Router>

<style>
  nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #f8f8f8;
    border-radius: 8px;
  }

  nav :global(a) {
    color: #00b3e6;
    text-decoration: none;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  nav :global(a:hover) {
    background-color: #e6f7ff;
  }

  .content {
    padding: 1rem;
  }
</style>
