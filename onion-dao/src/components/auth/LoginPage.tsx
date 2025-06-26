import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type UserType, useAuth } from '../../contexts/AuthContext';
import CorporationLogin from './CorporationLogin';
import EmployeeLogin from './EmployeeLogin';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect if user is already authenticated and has a profile
  useEffect(() => {
    if (!loading && currentUser && userProfile) {
      navigate('/dashboard');
    }
  }, [currentUser, userProfile, loading, navigate]);

  if (selectedType) {
    return selectedType === 'corporation' ? 
      <CorporationLogin 
        isSignUp={isSignUp} 
        onBack={() => setSelectedType(null)}
        onToggleMode={() => setIsSignUp(!isSignUp)} 
      /> :
      <EmployeeLogin 
        isSignUp={isSignUp} 
        onBack={() => setSelectedType(null)}
        onToggleMode={() => setIsSignUp(!isSignUp)} 
      />;
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H15.5L19,7.5V9Z"/>
              </svg>
            </div>
            <span className="brand-text">OnionUSD-P</span>
          </div>
          <h1 className="login-title">
            <span className="title-gradient">Choose Your</span><br />
            <span className="title-highlight">Account Type</span>
          </h1>
          <p className="login-subtitle">
            Access the future of private payments with enterprise-grade security
          </p>
        </div>

        <div className="account-types">
          <div className="account-card corporation-card" onClick={() => setSelectedType('corporation')}>
            <div className="card-glow"></div>
            <div className="card-header">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,2V20C4,21.11 4.89,22 6,22H10V20.5H20L22,22V4C22,2.89 21.11,2 20,2H4M6,4H20V20H8V4H6M10,6V8H18V6H10M10,10V12H18V10H10M10,14V16H18V14H10Z"/>
                </svg>
              </div>
              <div className="card-badge">Enterprise</div>
            </div>
            <h3 className="card-title">Corporation</h3>
            <p className="card-description">
              Complete payroll management with confidential transaction processing and compliance controls
            </p>
            <div className="card-features">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Bulk payroll processing</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>Private transaction amounts</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Compliance & reporting</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <span>Employee management</span>
              </div>
            </div>
            <button className="card-button primary-button">
              <span>Continue as Corporation</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
              </svg>
            </button>
          </div>

          <div className="account-card employee-card" onClick={() => setSelectedType('employee')}>
            <div className="card-glow"></div>
            <div className="card-header">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <div className="card-badge">Personal</div>
            </div>
            <h3 className="card-title">Employee</h3>
            <p className="card-description">
              Secure access to private payments with complete transaction history and balance tracking
            </p>
            <div className="card-features">
              <div className="feature-item">
                <div className="feature-icon">💰</div>
                <span>Receive payroll payments</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <span>Mobile wallet access</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔐</div>
                <span>Private balance tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                <span>Secure authentication</span>
              </div>
            </div>
            <button className="card-button secondary-button">
              <span>Continue as Employee</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="auth-toggle">
          <div className="toggle-container">
            <span className="toggle-text">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button className="toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 