import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import Header from './components/Header.js';
import Login from './pages/Login.js';
import Htlanding from './pages/Htlanding.js';
import Htcontent from './pages/Htcontent.js';
import Adlanding from './pages/Adlanding.js';
import Adcontent from './pages/Adcontent.js';
import MainRedirect from './pages/MainRedirect.js'

function App() {
  return (
    <Router>
      <RoutesWithNavbar />
    </Router>
  );
}

function RoutesWithNavbar() {
  let location = useLocation();

  return (
    <AppProvider>
      {location.pathname !== '/login' && <Header />}
      <Routes>
        <Route path="/" main element={<MainRedirect />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/htlanding" element={<Htlanding/>} />
        <Route path="/htcontent" element={<Htcontent/>} />
        <Route path="/adlanding" element={<Adlanding/>} />
        <Route path="/adcontent" element={<Adcontent/>} />
      </Routes>
    </AppProvider>
  );
}

export default App;
