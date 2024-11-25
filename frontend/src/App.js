// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import DictionaryPage from './pages/DictionaryPage';
import UserManagementPage from './pages/UserManagementPage';
import ContentPage from './pages/ContentPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={< DictionaryPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/content" element={<ContentPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
