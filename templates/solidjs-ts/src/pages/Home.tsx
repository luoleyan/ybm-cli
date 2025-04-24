import { Component } from 'solid-js'
import Counter from '../components/Counter'

interface HomeProps {
  count: number;
  setCount: (value: number | ((prev: number) => number)) => void;
}

const Home: Component<HomeProps> = (props) => {
  return (
    <div class="home">
      <h1>Home Page</h1>
      <p>Welcome to the SolidJS + TypeScript template!</p>
      <Counter count={props.count} setCount={props.setCount} />
    </div>
  )
}

export default Home
