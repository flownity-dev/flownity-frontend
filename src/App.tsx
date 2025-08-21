import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './theme/ThemeProvider';
import Diagram from './components/Diagram';
import Login from './components/Login';
import HomePage from './components/Homepage';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/diagram" element={
            <div style={{
              width: '100vw',
              height: '100vh',
              margin: 0,
              padding: 0,
              overflow: 'hidden'
            }}>
              <Diagram />
            </div>
          } />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
