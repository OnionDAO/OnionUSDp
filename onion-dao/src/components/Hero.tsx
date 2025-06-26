import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">🔒 Privacy-Preserving Stablecoin</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-main">OnionUSD-P</span>
            <span className="title-subtitle">Hide amounts, not compliance</span>
          </h1>
          
          <p className="hero-description">
            The first USD-pegged stablecoin with confidential transfers on Solana.<br />
            Built with Token-2022 extensions for privacy without sacrificing regulatory oversight.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-large">
              Try Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button className="btn btn-secondary btn-large">
              Read Documentation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
              </svg>
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">$0.00</div>
              <div className="stat-label">Transaction Fees</div>
            </div>
                         <div className="stat">
               <div className="stat-value">&lt; 1s</div>
               <div className="stat-label">Settlement Time</div>
             </div>
            <div className="stat">
              <div className="stat-value">100%</div>
              <div className="stat-label">Reserve Backed</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="transaction-demo">
            <div className="demo-card">
              <div className="card-header">
                <div className="card-title">Public Transfer</div>
                <div className="card-status status-visible">Visible</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Amount:</span>
                  <span className="tx-value visible">$1,250.00</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">From:</span>
                  <span className="tx-address">0x1a2b...3c4d</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">To:</span>
                  <span className="tx-address">0x5e6f...7g8h</span>
                </div>
              </div>
            </div>
            
            <div className="demo-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
              </svg>
            </div>
            
            <div className="demo-card private">
              <div className="card-header">
                <div className="card-title">OnionUSD-P Transfer</div>
                <div className="card-status status-private">Private</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Amount:</span>
                  <span className="tx-value private">•••••••</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">From:</span>
                  <span className="tx-address">0x1a2b...3c4d</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">To:</span>
                  <span className="tx-address">0x5e6f...7g8h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 