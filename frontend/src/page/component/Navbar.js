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
        {userRole === 'manager' && (
          <li>
            <NavLink to="/settings" activeClassName="active" className="navbar-link">
              Settings
            </NavLink>
          </li>
        )}
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
