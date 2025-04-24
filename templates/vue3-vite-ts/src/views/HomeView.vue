<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
const message = ref<string>('Welcome to Your Vue.js + TypeScript App')
</script>

<template>
  <main>
    <h1>{{ message }}</h1>
    <div class="counter">
      <p>Count: {{ counterStore.count }}</p>
      <button @click="counterStore.increment()">Increment</button>
      <button @click="counterStore.doubleCount">Double Count: {{ counterStore.doubleCount }}</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.counter {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
