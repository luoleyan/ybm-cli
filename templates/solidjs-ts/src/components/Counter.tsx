import { Component } from 'solid-js'

interface CounterProps {
  count: number;
  setCount: (value: number | ((prev: number) => number)) => void;
}

const Counter: Component<CounterProps> = (props) => {
  const increment = () => {
    props.setCount(prev => prev + 1)
  }

  const decrement = () => {
    props.setCount(prev => prev - 1)
  }

  return (
    <div class="counter">
      <h2>Counter: {props.count}</h2>
      <div class="counter-buttons">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}

export default Counter
