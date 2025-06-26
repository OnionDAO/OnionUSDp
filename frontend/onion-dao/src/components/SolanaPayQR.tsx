import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import type { PaymentRequest } from '../services/solanaPayService';
import './SolanaPayQR.css';

interface SolanaPayQRProps {
  paymentRequest: PaymentRequest;
  onPaymentCompleted?: (signature: string) => void;
  onPaymentFailed?: (error: string) => void;
  size?: number;
  showDetails?: boolean;
  className?: string;
}

const SolanaPayQR: React.FC<SolanaPayQRProps> = ({
  paymentRequest,
  size = 256,
  showDetails = true,
  className = ''
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | 'expired'>('pending');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Update time remaining
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expiresAt = new Date(paymentRequest.expiresAt).getTime();
      const difference = expiresAt - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setPaymentStatus('expired');
        setTimeRemaining('Expired');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [paymentRequest.expiresAt]);

  // Copy payment URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentRequest.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Open payment URL in wallet
  const openInWallet = () => {
    if (window.solana) {
      window.open(paymentRequest.url, '_blank');
    } else {
      // Fallback for mobile wallets
      window.location.href = paymentRequest.url;
    }
  };

  const formatAmount = (amount: number, token: string) => {
    if (token === 'SOL') {
      return `${amount.toFixed(4)} SOL`;
    }
    return `$${amount.toLocaleString()} ${token}`;
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'pending': return '#f59e0b'; // amber
      case 'completed': return '#10b981'; // emerald
      case 'failed': return '#ef4444'; // red
      case 'expired': return '#6b7280'; // gray
      default: return '#f59e0b';
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'expired': return '⏰';
      default: return '⏳';
    }
  };

  return (
    <div className={`solana-pay-qr ${className}`}>
      {/* QR Code Display */}
      <div className="qr-code-container">
        <div className="qr-code-wrapper">
          <QRCode
            value={paymentRequest.url}
            size={size}
            style={{ 
              height: "auto", 
              maxWidth: "100%", 
              width: "100%",
              opacity: paymentStatus === 'expired' ? 0.5 : 1
            }}
            viewBox={`0 0 256 256`}
          />
          
          {/* Status overlay */}
          <div className="qr-status-overlay">
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor() }}
            >
              <span className="status-icon">{getStatusIcon()}</span>
              <span className="status-text">{paymentStatus.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {showDetails && (
        <div className="payment-details">
          <div className="payment-header">
            <h3 className="payment-title">Payment Request</h3>
            <div className="payment-id">#{paymentRequest.id}</div>
          </div>

          <div className="payment-info">
            <div className="info-row">
              <span className="info-label">Amount:</span>
              <span className="info-value amount">
                {formatAmount(paymentRequest.amount, paymentRequest.token || 'USDC')}
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Recipient:</span>
              <span className="info-value address">
                {`${paymentRequest.recipient.slice(0, 6)}...${paymentRequest.recipient.slice(-4)}`}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Memo:</span>
              <span className="info-value memo">{paymentRequest.memo}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Expires:</span>
              <span className="info-value time">{timeRemaining}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="payment-actions">
            <button 
              className="btn btn-primary"
              onClick={openInWallet}
              disabled={paymentStatus === 'expired' || paymentStatus === 'completed'}
            >
              <span className="material-icons">account_balance_wallet</span>
              Open in Wallet
            </button>

            <button 
              className="btn btn-secondary"
              onClick={copyToClipboard}
            >
              <span className="material-icons">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Instructions */}
          <div className="payment-instructions">
            <h4>How to pay:</h4>
            <ol>
              <li>Scan the QR code with your Solana wallet app</li>
              <li>Or click "Open in Wallet" if using a browser extension</li>
              <li>Review the payment details and confirm</li>
              <li>Payment will be processed instantly</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolanaPayQR; 