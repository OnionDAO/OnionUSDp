import React, { useState } from 'react';
import './TechnicalDemo.css';

const TechnicalDemo: React.FC = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { title: "Connect Wallet", description: "Connect your Solana wallet", status: "completed" },
    { title: "Deposit Funds", description: "Move tokens to confidential balance", status: demoStep >= 1 ? "completed" : "pending" },
    { title: "Generate Proof", description: "Create zero-knowledge proof", status: demoStep >= 2 ? "completed" : "pending" },
    { title: "Send Payment", description: "Transfer with hidden amounts", status: demoStep >= 3 ? "completed" : "pending" }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDemoStep(i);
    }
    setIsRunning(false);
  };

  return (
    <section className="technical-demo">
      <div className="demo-container">
        <div className="demo-header">
          <h2 className="demo-title">See it in Action</h2>
          <p className="demo-subtitle">
            Experience the power of confidential transfers with our interactive demo
          </p>
        </div>
        
        <div className="demo-content">
          <div className="demo-steps">
            {steps.map((step, index) => (
              <div key={index} className={`demo-step ${step.status}`}>
                <div className="step-indicator">
                  {step.status === 'completed' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                  ) : (
                    <span className="step-number">{index + 1}</span>
                  )}
                </div>
                <div className="step-content">
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
          
          <div className="demo-visualization">
            <div className="demo-interface">
              <div className="interface-header">
                <div className="interface-title">OnionUSD-P Transfer</div>
                <div className="interface-status">
                  {isRunning ? 'Processing...' : demoStep === 3 ? 'Completed' : 'Ready'}
                </div>
              </div>
              
              <div className="interface-body">
                <div className="transfer-form">
                  <div className="form-group">
                    <label>From</label>
                    <div className="address-input">
                      <span className="wallet-icon">👛</span>
                      Your Wallet
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>To</label>
                    <div className="address-input">
                      0x5e6f...7g8h
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Amount</label>
                    <div className="amount-input">
                      {demoStep >= 2 ? (
                        <span className="hidden-amount">•••••••</span>
                      ) : (
                        <span>1,250.00 OUSD-P</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="privacy-indicator">
                    <div className={`privacy-toggle ${demoStep >= 1 ? 'enabled' : ''}`}>
                      <div className="toggle-switch"></div>
                    </div>
                    <span>Confidential Transfer</span>
                  </div>
                </div>
                
                <button 
                  className={`demo-button ${isRunning ? 'loading' : ''}`}
                  onClick={runDemo}
                  disabled={isRunning}
                >
                  {isRunning ? 'Processing...' : demoStep === 3 ? 'Reset Demo' : 'Run Demo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalDemo; 