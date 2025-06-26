import React, { useState } from 'react';
import './AdvancedFeatures.css';

const AdvancedFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "Confidential Transfers",
      subtitle: "Hide amounts, preserve privacy",
      description: "Transfer OnionUSD-P without revealing transaction amounts on-chain. Only sender and receiver can see the actual values.",
      icon: "🔒",
      details: [
        { label: "Zero-Knowledge Proofs", value: "Bulletproofs for amount hiding" },
        { label: "Homomorphic Encryption", value: "Balance confidentiality" },
        { label: "Privacy Level", value: "Amount-level privacy" },
        { label: "Compliance", value: "Address visibility maintained" }
      ]
    },
    {
      title: "Solana Pay Integration",
      subtitle: "Accept private payments instantly",
      description: "Seamlessly integrate with Solana Pay for merchant payments, QR codes, and payment requests with full privacy.",
      icon: "⚡",
      details: [
        { label: "QR Code Payments", value: "Private payment requests" },
        { label: "Settlement Speed", value: "< 1 second finality" },
        { label: "Transaction Fees", value: "$0.00025 average" },
        { label: "Integration", value: "One-line SDK" }
      ]
    },
    {
      title: "Multisig Governance",
      subtitle: "Decentralized control via Squads",
      description: "Token governance managed through battle-tested Squads multisig for enhanced security and decentralized decision making.",
      icon: "🏛️",
      details: [
        { label: "Multisig Security", value: "Squads protocol" },
        { label: "Threshold Control", value: "Customizable M-of-N" },
        { label: "Governance Actions", value: "Mint, freeze, upgrade" },
        { label: "Transparency", value: "On-chain proposals" }
      ]
    },
    {
      title: "Developer APIs",
      subtitle: "Build privacy into your app",
      description: "Comprehensive APIs and SDKs for integrating OnionUSD-P into any application with minimal code changes.",
      icon: "🛠️",
      details: [
        { label: "REST API", value: "Full HTTP interface" },
        { label: "SDK Support", value: "TypeScript, Rust, Python" },
        { label: "Documentation", value: "Complete guides & examples" },
        { label: "Sandbox", value: "Free testnet access" }
      ]
    }
  ];

  return (
    <section className="advanced-features" id="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">
            Advanced Features to<br />
            <span className="title-highlight">revolutionize Your Payments.</span>
          </h2>
          <p className="features-subtitle">
            From confidential transfers to seamless integrations, we've got you covered.
          </p>
        </div>
        
        <div className="features-content">
          <div className="features-tabs">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`feature-tab ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <div className="tab-header">
                  <span className="tab-icon">{feature.icon}</span>
                  <div className="tab-content">
                    <h3 className="tab-title">{feature.title}</h3>
                    <p className="tab-subtitle">{feature.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="feature-showcase">
            <div className="showcase-content">
              <div className="showcase-info">
                <div className="showcase-badge">
                  <span className="badge-icon">{features[activeTab].icon}</span>
                  <span className="badge-text">Feature Highlight</span>
                </div>
                
                <h3 className="showcase-title">{features[activeTab].title}</h3>
                <p className="showcase-description">{features[activeTab].description}</p>
                
                <div className="feature-details">
                  {features[activeTab].details.map((detail, index) => (
                    <div key={index} className="detail-row">
                      <span className="detail-label">{detail.label}</span>
                      <span className="detail-value">{detail.value}</span>
                    </div>
                  ))}
                </div>
                
                <button className="btn btn-primary showcase-btn">
                  Try {features[activeTab].title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                  </svg>
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures; 