import React, { useEffect } from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MasterPage from './pages/MasterPage.js';
import MainPage from './pages/MainPage.js';
import { AppProvider } from './context/AppContext';


function App() {
  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleRightClick);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <AppProvider>
      <Router>

        <Routes>
          <Route path="/" element={<MasterPage />} />
          <Route path="/hotel/" element={<MainPage />} />
        </Routes>

      </Router>
    </AppProvider>
  );
}

export default App;
