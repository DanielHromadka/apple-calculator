import React, { useState } from 'react';
import './App.css';
import Calculator from './components/Calculator';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <Calculator />
    </div>
  );
}

export default App;
