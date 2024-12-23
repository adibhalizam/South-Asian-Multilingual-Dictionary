// src/page/component/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../style/NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing user session)
    alert('Logged out successfully!');
    navigate('/'); // Redirect to home or login page after logout
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <NavLink to="/content" activeClassName="active" className="navbar-link">
            Content
          </NavLink>
        </li>
        <li>
          <NavLink to="/help" activeClassName="active" className="navbar-link">
            Help
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" activeClassName="active" className="navbar-link">
            Settings
          </NavLink>
        </li>
        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
