<script>
  import { onMount } from "svelte";

  onMount(() => {
    console.log("About component mounted");
  });
</script>

<div class="about">
  <h1>关于页面</h1>
  <p>这是一个使用 YBM CLI 创建的 Svelte 项目</p>
  <p>你可以根据自己的需求修改这个页面</p>
</div>

<style>
  .about {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 2.5em;
    margin-bottom: 0.5em;
  }
</style>
