import React from 'react';
import './Architecture.css';

const Architecture: React.FC = () => {
  return (
    <section className="architecture" id="architecture">
      <div className="architecture-container">
        <div className="architecture-header">
          <h2 className="architecture-title">Architecture</h2>
        </div>
        
        <div className="architecture-content">
          <div className="architecture-panel">
            <div className="panel-header">
              <h3 className="panel-title">Privacy Technology</h3>
            </div>
            <div className="panel-content">
              <p className="panel-description">
                OnionUSD-P uses Solana's Token-2022 Confidential Transfer extension to hide transaction amounts using zero-knowledge proofs and homomorphic encryption, giving you a seamless private payment experience.
              </p>
              
              <div className="tech-visualization">
                <div className="onion-icon">
                  🧅
                </div>
                <div className="tech-flow">
                  <div className="tech-step">
                    <div className="step-icon solana">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  <div className="tech-step">
                    <div className="step-icon metamask">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="tech-step">
                    <div className="step-icon anchor">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H19A5,5 0 0,0 14,9H13V10.27C13.6,10.61 14,11.26 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10C12.74,10 13.39,10.4 13.73,11H14A3,3 0 0,0 11,8H10V5.73C9.4,5.39 9,4.74 9,4A2,2 0 0,1 12,2M12,15A3,3 0 0,1 15,18V22H9V18A3,3 0 0,1 12,15Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="tech-step">
                    <div className="step-icon raydium">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6,2V8H6V8L10,12L6,16V16H6V22H12V16H18V8H12V2H6Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="tech-step">
                    <div className="step-icon jupiter">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="tech-step">
                    <div className="step-icon wire">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M8,13H16V14H8V13Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="architecture-panel">
            <div className="panel-header">
              <h3 className="panel-title">Compliance Ready</h3>
            </div>
            <div className="panel-content">
              <p className="panel-description">
                The OnionUSD-P protocol is fully non-custodial, secured by proven Solana infrastructure for managing private keys across blockchains. With built-in compliance features and optional auditor access for regulatory oversight.
              </p>
              
              <div className="compliance-visualization">
                <div className="compliance-flow">
                  <div className="secure-box">
                    <div className="secure-label">Secure</div>
                    <div className="secure-content">
                      <div className="audit-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.66 16,12.08 16,13V16C16,17.11 15.11,18 14,18H10C8.89,18 8,17.11 8,16V13C8,12.08 8.6,11.66 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11.5H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
                        </svg>
                      </div>
                      <div className="compliance-icons">
                        <div className="compliance-step">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
                            <path d="M19,3H5C3.89,3 3,3.89 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
                          </svg>
                        </div>
                        <div className="compliance-step">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
                            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-box">
                    <div className="user-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                      </svg>
                    </div>
                    <div className="user-label">User</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture; 