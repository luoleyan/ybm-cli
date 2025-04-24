import { onMount } from "solid-js";

function About() {
  onMount(() => {
    console.log("About component mounted");
  });

  return (
    <div class="about">
      <h1>关于页面</h1>
      <p>这是一个使用 YBM CLI 创建的 SolidJS 项目</p>
      <p>你可以根据自己的需求修改这个页面</p>
    </div>
  );
}

export default About;
