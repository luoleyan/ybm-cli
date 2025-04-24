<template>
  <main>
    <div class="home">
      <h1>欢迎使用 YBM CLI 创建的 Vue 项目</h1>
      <p>这是一个使用 Vue 3 和 Vite 构建的项目</p>
      
      <div class="features">
        <h2>特性</h2>
        <ul>
          <li>Vue 3</li>
          <li>Vite</li>
          <li>Vue Router</li>
          <li>Pinia 状态管理</li>
        </ul>
      </div>
      
      <HelloWorld msg="开始你的开发之旅吧!" />
    </div>
  </main>
</template>

<script setup>
import HelloWorld from '../components/HelloWorld.vue'
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 2rem;
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
  background-color: var(--color-background-soft);
  border-radius: 4px;
}
</style>
