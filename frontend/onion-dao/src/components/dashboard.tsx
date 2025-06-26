import React, { useState } from 'react';
import TypingAnimation from './TypingAnimation';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [showSubtitle, setShowSubtitle] = useState(false);

  const handleTypingComplete = () => {
    setTimeout(() => {
      setShowSubtitle(true);
    }, 300);
  };

  // Words to cycle through
  const payrollWords = [
    'Modern Payroll', 
    'Smart Payroll',
    'Trusted Payroll',
    'Simple Payroll',
    'Seamless Payroll',
    'On-Chain Payroll',
    'Confidential Payroll',
  ];
  

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Main Content */}
        <div className="main-content">
          <div className="hero-section">
            <h1 className="hero-title">
              <span className="title-primary">Everyone's Favorite</span>
              <TypingAnimation
                words={payrollWords}
                className="title-gradient"
                onComplete={handleTypingComplete}
                delay={100}
                cycleDelay={1500}
              />
            </h1>
            
            <p className={`hero-subtitle ${showSubtitle ? 'fade-in' : 'fade-out'}`}>
              Streamline employee payments across multiple departments with<br />
              our modern, secure platform
            </p>

            <div className="feature-grid">
              <div className="feature-icon" style={{'--delay': '2.0s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V18h2v-6.5C22 9.57 20.43 8 18.5 8S15 9.57 15 11.5V12h-2.5C11.67 12 11 11.33 11 10.5S10.33 9 9.5 9 8 9.67 8 10.5V18H4z"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.1s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.2s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.3s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.4s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.5s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.6s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/>
                </svg>
              </div>

              <div className="feature-icon" style={{'--delay': '2.7s'} as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar animated-sidebar">
          <div className="sidebar-section animated-section" style={{'--delay': '0.5s'} as React.CSSProperties}>
            <div className="section-label">From Department</div>
            
            <div className="status-card animated-card">
              <div className="card-info">
                <div className="department-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="card-details">
                  <h3 className="card-title">Engineering</h3>
                  <p className="card-subtitle">Main Office</p>
                </div>
              </div>
              <div className="status-badge status-ready">Ready</div>
            </div>
          </div>

          <div className="sidebar-section animated-section" style={{'--delay': '0.7s'} as React.CSSProperties}>
            <div className="section-label">To Employees</div>
            
            <div className="status-card animated-card">
              <div className="card-info">
                <div className="employees-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V18h2v-6.5C22 9.57 20.43 8 18.5 8S15 9.57 15 11.5V12h-2.5C11.67 12 11 11.33 11 10.5S10.33 9 9.5 9 8 9.67 8 10.5V18H4z"/>
                  </svg>
                </div>
                <div className="card-details">
                  <h3 className="card-title">All Staff</h3>
                  <p className="card-subtitle">12 employees</p>
                </div>
              </div>
              <div className="status-badge status-pending">Pending</div>
            </div>
          </div>

          <button className="btn btn-primary process-btn animated-button" style={{'--delay': '0.9s'} as React.CSSProperties}>
            Process Payroll
          </button>

          <div className="security-info animated-info" style={{'--delay': '1.1s'} as React.CSSProperties}>
            <p>Secure • Encrypted • Compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 