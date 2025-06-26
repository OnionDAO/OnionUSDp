import React from 'react';
import './UseCases.css';

const UseCases: React.FC = () => {
  const useCases = [
    {
      title: "Merchant Payments",
      description: "Accept stablecoin payments without revealing amounts to competitors or the public",
      icon: "🏪",
      features: ["Private checkout", "Instant settlement", "Low fees", "Regulatory compliant"],
      color: "#4A90E2"
    },
    {
      title: "Payroll & B2B",
      description: "Private business transactions with full compliance and audit capabilities",
      icon: "💼",
      features: ["Employee privacy", "Bulk payments", "Audit trails", "Tax compliance"],
      color: "#22c55e"
    },
    {
      title: "DeFi Integration",
      description: "Bring privacy to decentralized finance while maintaining transparency",
      icon: "🏛️",
      features: ["Private lending", "Hidden positions", "MEV protection", "Yield farming"],
      color: "#f59e0b"
    }
  ];

  return (
    <section className="use-cases">
      <div className="use-cases-container">
        <div className="use-cases-header">
          <h2 className="use-cases-title">Use Cases</h2>
          <p className="use-cases-subtitle">
            OnionUSD-P enables privacy across multiple domains while maintaining regulatory compliance
          </p>
        </div>
        
        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <div key={index} className="use-case-card" style={{'--accent-color': useCase.color} as React.CSSProperties}>
              <div className="card-icon">
                {useCase.icon}
              </div>
              <h3 className="card-title">{useCase.title}</h3>
              <p className="card-description">{useCase.description}</p>
              <ul className="card-features">
                {useCase.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="card-button">
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases; 