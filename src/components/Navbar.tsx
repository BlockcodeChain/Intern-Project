import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo" onClick={() => navigate('/')}> 
          <span className="logo-icon">📝</span> ATS RESUME BUILDER
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Builder</Link>
          <Link to="/Register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link nav-cta">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 