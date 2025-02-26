// src/page/component/Navbar.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../style/NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/session', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated) {
          navigate('/');
          return;
        }
        
        setUserRole(data.role);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Only navigate after successful logout
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <NavLink to="/content" activeClassName="active" className="navbar-link">
            Content
          </NavLink>
        </li>
        {userRole === 'manager' && (
          <li>
            <NavLink to="/settings" activeClassName="active" className="navbar-link">
              Settings
            </NavLink>
          </li>
        )}
        <li>
        <button onClick={handleLogout} className="navbar-link">
          Logout
        </button>
        </li>
      </ul>
    </nav>
  );
};


export default Navbar;
