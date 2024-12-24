// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Dictionary from './page/Dictionary';
import Content from './page/Content';
import Help from './page/Help';
import Settings from './page/Settings';
import Navbar from './page/component/Navbar';  // Import Navbar

const Layout = ({ children }) => {
  const location = useLocation();  // Get the current location

  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* Conditionally render Navbar based on the current route */}
      {location.pathname !== '/' && <Navbar />} 
      
      <div style={{ marginLeft: location.pathname !== '/' ? '200px' : '0', padding: '10px', width: '100%' }}>
        {/* Content area with left margin if navbar is displayed */}
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dictionary />} />
        <Route 
          path="/content" 
          element={<Layout><Content /></Layout>} 
        />
        <Route 
          path="/help" 
          element={<Layout><Help /></Layout>} 
        />
        <Route 
          path="/settings" 
          element={<Layout><Settings /></Layout>} 
        />
      </Routes>
    </Router>
  );
};

export default App;

