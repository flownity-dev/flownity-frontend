import './App.css'
import Diagram from './components/Diagram'

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden'
    }}>
      <Diagram />
    </div>
  )
}

export default App
