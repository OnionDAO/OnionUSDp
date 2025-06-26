import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { currentUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          <Link to="/" className="logo">
            <div className="logo-icon">🧅</div>
            <span className="brand-text">OnionUSD-P</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#architecture" className="nav-link">Architecture</a>
          <a href="#docs" className="nav-link">Docs</a>
          <a href="#api" className="nav-link">API</a>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary">
                Dashboard
              </Link>
              <div className="user-info">
                <span className="user-name">
                  {userProfile?.userType === 'corporation' ? userProfile.companyName : userProfile?.employeeName}
                </span>
                <button onClick={handleSignOut} className="btn btn-outline">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-secondary">
                View Demo
              </button>
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 