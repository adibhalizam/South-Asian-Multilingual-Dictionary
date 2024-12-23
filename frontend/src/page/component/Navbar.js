// src/page/component/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../style/NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); 
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
          <NavLink to="/" activeClassName="active" className="navbar-link">
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
