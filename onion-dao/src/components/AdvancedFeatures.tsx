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
              
              <div className="showcase-visual">
                <div className="demo-interface">
                  {activeTab === 0 && (
                    <div className="confidential-demo">
                      <div className="demo-header">
                        <div className="demo-title">Private Transfer</div>
                        <div className="demo-status">Processing...</div>
                      </div>
                      <div className="demo-body">
                        <div className="transfer-row">
                          <span>From:</span>
                          <span className="address">0x1a2b...3c4d</span>
                        </div>
                        <div className="transfer-row">
                          <span>To:</span>
                          <span className="address">0x5e6f...7g8h</span>
                        </div>
                        <div className="transfer-row highlighted">
                          <span>Amount:</span>
                          <span className="amount-hidden">•••••••</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 1 && (
                    <div className="pay-demo">
                      <div className="qr-section">
                        <div className="qr-placeholder">
                          <div className="qr-code">
                            <div className="qr-pattern"></div>
                          </div>
                        </div>
                        <div className="pay-info">
                          <div className="merchant">Coffee Shop</div>
                          <div className="amount-private">Amount: Hidden</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 2 && (
                    <div className="governance-demo">
                      <div className="proposal-card">
                        <div className="proposal-header">
                          <div className="proposal-title">Proposal #1</div>
                          <div className="proposal-status">Active</div>
                        </div>
                        <div className="proposal-content">
                          <p>Update mint authority</p>
                          <div className="voting-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{width: '75%'}}></div>
                            </div>
                            <span className="vote-count">3 of 4 votes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 3 && (
                    <div className="api-demo">
                      <div className="code-block">
                        <div className="code-header">
                          <div className="code-lang">TypeScript</div>
                          <div className="copy-btn">Copy</div>
                        </div>
                        <div className="code-content">
                          <div className="code-line">
                            <span className="code-keyword">import</span> {`{ OnionUSD }`} <span className="code-keyword">from</span> <span className="code-string">'@onion/sdk'</span>
                          </div>
                          <div className="code-line">
                            <span className="code-keyword">const</span> <span className="code-var">payment</span> = <span className="code-keyword">await</span> onion.transfer({`{`}
                          </div>
                          <div className="code-line indent">
                            <span className="code-property">to</span>: <span className="code-string">'0x...'</span>,
                          </div>
                          <div className="code-line indent">
                            <span className="code-property">amount</span>: <span className="code-number">100</span>,
                          </div>
                          <div className="code-line indent">
                            <span className="code-property">private</span>: <span className="code-boolean">true</span>
                          </div>
                          <div className="code-line">{`})`}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures; 