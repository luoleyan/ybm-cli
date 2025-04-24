<template>
  <div class="hello">
    <h3>{{ msg }}</h3>
    <div class="links">
      <a href="https://vuejs.org/" target="_blank">Vue 官方文档</a>
      <a href="https://router.vuejs.org/" target="_blank">Vue Router 文档</a>
      <a href="https://vuex.vuejs.org/" target="_blank">Vuex 文档</a>
      <a href="https://cli.vuejs.org/" target="_blank">Vue CLI 文档</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.hello {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

h3 {
  margin: 40px 0 0;
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.links a {
  display: inline-block;
  padding: 5px 10px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.links a:hover {
  background-color: #3aa876;
}
</style>
