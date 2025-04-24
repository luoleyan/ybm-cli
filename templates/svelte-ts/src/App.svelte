<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
</script>

<Router>
  <nav>
    <Link to="/">Home</Link> | 
    <Link to="about">About</Link>
  </nav>
  
  <div>
    <Route path="/">
      <Home />
    </Route>
    <Route path="about">
      <About />
    </Route>
  </div>
</Router>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  nav {
    padding: 1rem;
    background-color: #f0f0f0;
    text-align: center;
  }

  nav :global(a) {
    color: #4a4a4a;
    text-decoration: none;
    margin: 0 0.5rem;
    font-weight: bold;
  }

  nav :global(a.active) {
    color: #ff3e00;
  }
</style>
