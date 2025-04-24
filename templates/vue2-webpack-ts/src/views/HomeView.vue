<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <div class="counter">
      <p>Count: {{ $store.state.count }}</p>
      <button @click="increment">Increment</button>
      <p>Double Count: {{ $store.getters.doubleCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld
  }
})
export default class HomeView extends Vue {
  increment(): void {
    this.$store.commit('increment')
  }
}
</script>

<style scoped lang="scss">
.counter {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
  button {
    margin: 10px;
    padding: 5px 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    
    &:hover {
      background-color: darken(#42b983, 10%);
    }
  }
}
</style>
