<script lang="ts">
  let count: number = 0;
  
  function increment(): void {
    count += 1;
  }
  
  function decrement(): void {
    count -= 1;
  }
</script>

<div class="counter">
  <h2>Counter: {count}</h2>
  <div class="counter-buttons">
    <button on:click={decrement}>-</button>
    <button on:click={increment}>+</button>
  </div>
</div>

<style>
  .counter {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .counter-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 4px;
    background-color: #ff3e00;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #d03400;
  }
</style>
