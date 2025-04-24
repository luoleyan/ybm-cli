import React from 'react'
import Counter from '../components/Counter'

interface HomeProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Home: React.FC<HomeProps> = ({ count, setCount }) => {
  return (
    <div className="home">
      <h1>Home Page</h1>
      <p>Welcome to the React + TypeScript template!</p>
      <Counter count={count} setCount={setCount} />
    </div>
  )
}

export default Home
