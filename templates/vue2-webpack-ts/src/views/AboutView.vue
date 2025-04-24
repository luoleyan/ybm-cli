<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>This is a TypeScript Vue 2 application created with YBM CLI.</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AboutView extends Vue {
  // TypeScript class component
}
</script>

<style scoped lang="scss">
.about {
  padding: 20px;
  
  h1 {
    color: #42b983;
  }
}
</style>
