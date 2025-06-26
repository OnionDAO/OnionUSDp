import React from 'react';
import './GettingStarted.css';

const GettingStarted: React.FC = () => {
  const tracks = [
    {
      title: "Users",
      subtitle: "Send private payments",
      description: "Get started with OnionUSD-P in minutes",
      icon: "👤",
      steps: [
        "Install a compatible wallet",
        "Acquire OnionUSD-P tokens",
        "Enable confidential transfers",
        "Send private payments"
      ],
      cta: "Download Wallet"
    },
    {
      title: "Developers",
      subtitle: "Integrate OnionUSD-P",
      description: "Build privacy into your applications",
      icon: "💻",
      steps: [
        "Install the OnionUSD-P SDK",
        "Set up testnet environment",
        "Implement confidential transfers",
        "Deploy to production"
      ],
      cta: "View Documentation"
    },
    {
      title: "Businesses",
      subtitle: "Accept payments",
      description: "Enable private payments for your business",
      icon: "🏢",
      steps: [
        "Sign up for business account",
        "Integrate payment APIs",
        "Configure compliance settings",
        "Start accepting payments"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <section className="getting-started">
      <div className="getting-started-container">
        <div className="getting-started-header">
          <h2 className="getting-started-title">Getting Started</h2>
          <p className="getting-started-subtitle">
            Choose your path to privacy-preserving payments
          </p>
        </div>
        
        <div className="tracks-grid">
          {tracks.map((track, index) => (
            <div key={index} className="track-card">
              <div className="track-header">
                <div className="track-icon">{track.icon}</div>
                <div className="track-info">
                  <h3 className="track-title">{track.title}</h3>
                  <p className="track-subtitle">{track.subtitle}</p>
                </div>
              </div>
              
              <p className="track-description">{track.description}</p>
              
              <div className="track-steps">
                {track.steps.map((step, idx) => (
                  <div key={idx} className="track-step">
                    <div className="step-number">{idx + 1}</div>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
              
              <button className="track-button">
                {track.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="ecosystem-info">
          <h3 className="ecosystem-title">Powered by Solana</h3>
          <p className="ecosystem-description">
            Built on Solana's high-performance blockchain with Token-2022 extensions for maximum security and scalability
          </p>
          <div className="ecosystem-badges">
            <div className="ecosystem-badge">
              <span className="badge-icon">⚡</span>
              <span className="badge-text">Sub-second finality</span>
            </div>
            <div className="ecosystem-badge">
              <span className="badge-icon">💰</span>
              <span className="badge-text">Ultra-low fees</span>
            </div>
            <div className="ecosystem-badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">Battle-tested security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted; 