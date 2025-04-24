import React from 'react'

interface CounterProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Counter: React.FC<CounterProps> = ({ count, setCount }) => {
  const increment = (): void => {
    setCount(prevCount => prevCount + 1)
  }

  const decrement = (): void => {
    setCount(prevCount => prevCount - 1)
  }

  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <div className="counter-buttons">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}

export default Counter
