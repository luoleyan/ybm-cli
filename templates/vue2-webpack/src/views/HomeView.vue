<template>
  <div class="home">
    <h1>欢迎使用 YBM CLI 创建的 Vue2 项目</h1>
    <p>这是一个使用 Vue 2 和 Webpack 构建的项目</p>
    
    <div class="features">
      <h2>特性</h2>
      <ul>
        <li>Vue 2</li>
        <li>Vue Router</li>
        <li>Vuex</li>
        <li>Webpack</li>
      </ul>
    </div>
    
    <div class="counter">
      <p>当前计数: {{ count }}</p>
      <p>双倍计数: {{ doubleCount }}</p>
      <button @click="increment">同步增加</button>
      <button @click="incrementAsync">异步增加</button>
    </div>
    
    <HelloWorld msg="开始你的开发之旅吧!" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount'])
  },
  methods: {
    ...mapMutations(['increment']),
    ...mapActions(['incrementAsync'])
  }
}
</script>

<style scoped>
.home {
  margin-top: 20px;
}

.features {
  margin: 20px 0;
}

.features ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.features li {
  padding: 5px 10px;
  background-color: #f2f2f2;
  border-radius: 4px;
}

.counter {
  margin: 20px 0;
}

button {
  margin: 0 5px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>
