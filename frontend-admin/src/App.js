import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import AdStatistics from './pages/AdStatistics.js';
import AdvertiserImage from './pages/AdvertiserImage.js';
import AdvertiserContent from './pages/AdvertiserContent.js';
import HotelLanding from './pages/HotelLanding.js';
import HotelContent from './pages/HotelContent.js';

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
        <Route path="/login" element={<Login />} />
        <Route path="/statistics" element={<AdStatistics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adimage" element={<AdvertiserImage />} />
        <Route path="/adcontent" element={<AdvertiserContent />} />
        <Route path="/htlanding" element={<HotelLanding />} />
        <Route path="/htcontent" element={<HotelContent />} />
        <Route path="/" element={<Navigate replace to="/profile" />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
