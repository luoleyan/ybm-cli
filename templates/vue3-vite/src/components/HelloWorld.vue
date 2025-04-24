<template>
  <div class="greetings">
    <h3>{{ msg }}</h3>
    <div class="links">
      <a href="https://vuejs.org/" target="_blank">Vue 官方文档</a>
      <a href="https://vitejs.dev/" target="_blank">Vite 官方文档</a>
      <a href="https://router.vuejs.org/" target="_blank">Vue Router 文档</a>
      <a href="https://pinia.vuejs.org/" target="_blank">Pinia 文档</a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.greetings {
  background-color: var(--color-background-soft);
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

h3 {
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
  background-color: var(--color-background-mute);
  border-radius: 4px;
}
</style>
