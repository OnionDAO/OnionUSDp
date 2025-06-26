import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

interface Payment {
  id: string;
  type: 'salary' | 'bonus' | 'reimbursement';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  private: boolean;
  from: string;
}

interface PaymentRequest {
  id: string;
  amount: number;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const EmployeeDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Mock data
  useEffect(() => {
    setPayments([
      {
        id: '1',
        type: 'salary',
        amount: 5000,
        date: '2025-01-15',
        status: 'completed',
        private: true,
        from: 'TechCorp Inc.'
      },
      {
        id: '2',
        type: 'bonus',
        amount: 1500,
        date: '2025-01-10',
        status: 'completed',
        private: true,
        from: 'TechCorp Inc.'
      },
      {
        id: '3',
        type: 'reimbursement',
        amount: 284,
        date: '2025-01-08',
        status: 'processing',
        private: false,
        from: 'TechCorp Inc.'
      }
    ]);

    setPaymentRequests([
      {
        id: '1',
        amount: 500,
        reason: 'Travel expenses for client meeting',
        date: '2025-01-12',
        status: 'pending'
      }
    ]);
  }, []);

  const renderOverview = () => (
    <div className="overview-section">
      <div className="balance-cards">
        <div className="balance-card main">
          <div className="balance-header">
            <h3>Total Balance</h3>
            <div className="balance-icon">💰</div>
          </div>
          <div className="balance-amount">$8,749.50</div>
          <div className="balance-change positive">+$1,284 this month</div>
          <div className="balance-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Public</span>
              <span className="breakdown-amount">$2,249.50</span>
              <span className="breakdown-icon">👁️</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Private</span>
              <span className="breakdown-amount">$6,500.00</span>
              <span className="breakdown-icon">🔒</span>
            </div>
          </div>
        </div>

        <div className="balance-card">
          <div className="balance-header">
            <h4>This Month</h4>
            <div className="balance-icon">📅</div>
          </div>
          <div className="balance-amount small">$6,784</div>
          <div className="balance-label">Total Received</div>
        </div>

        <div className="balance-card">
          <div className="balance-header">
            <h4>Pending</h4>
            <div className="balance-icon">⏳</div>
          </div>
          <div className="balance-amount small">$284</div>
          <div className="balance-label">Processing</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card large">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="activity-list">
            {payments.slice(0, 5).map(payment => (
              <div key={payment.id} className="activity-item">
                <div className="activity-icon">
                  {payment.type === 'salary' ? '💵' : payment.type === 'bonus' ? '🎉' : '📋'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {payment.type === 'salary' ? 'Salary Payment' : 
                     payment.type === 'bonus' ? 'Performance Bonus' : 'Expense Reimbursement'}
                  </div>
                  <div className="activity-meta">
                    ${payment.amount.toLocaleString()} • {payment.date} • {payment.from}
                    {payment.private && <span className="private-badge">🔒 Private</span>}
                  </div>
                </div>
                <div className={`status-badge ${payment.status}`}>{payment.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => setShowRequestModal(true)}>
              <div className="action-icon">💸</div>
              <div className="action-text">
                <strong>Request Payment</strong>
                <span>Submit expense or advance request</span>
              </div>
            </button>
            
            <button className="action-btn" onClick={() => setShowSendModal(true)}>
              <div className="action-icon">📤</div>
              <div className="action-text">
                <strong>Send Payment</strong>
                <span>Transfer to another wallet</span>
              </div>
            </button>
            
            <button className="action-btn">
              <div className="action-icon">📊</div>
              <div className="action-text">
                <strong>View Reports</strong>
                <span>Income & tax documents</span>
              </div>
            </button>
            
            <button className="action-btn">
              <div className="action-icon">⚙️</div>
              <div className="action-text">
                <strong>Settings</strong>
                <span>Privacy & preferences</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="payments-section">
      <div className="section-header">
        <h3>Payment History</h3>
        <div className="filters">
          <select className="filter-select">
            <option>All Types</option>
            <option>Salary</option>
            <option>Bonus</option>
            <option>Reimbursement</option>
          </select>
          <select className="filter-select">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>
      
      <div className="payments-table">
        <div className="table-header">
          <div>Type</div>
          <div>Amount</div>
          <div>From</div>
          <div>Date</div>
          <div>Privacy</div>
          <div>Status</div>
        </div>
        
        {payments.map(payment => (
          <div key={payment.id} className="table-row">
            <div className="payment-type">
              <span className={`type-badge ${payment.type}`}>
                {payment.type === 'salary' ? '💵' : payment.type === 'bonus' ? '🎉' : '📋'}
                {payment.type}
              </span>
            </div>
            <div className="amount">${payment.amount.toLocaleString()}</div>
            <div>{payment.from}</div>
            <div>{payment.date}</div>
            <div>
              <span className={`privacy-badge ${payment.private ? 'private' : 'public'}`}>
                {payment.private ? '🔒 Private' : '👁️ Public'}
              </span>
            </div>
            <div>
              <span className={`status-badge ${payment.status}`}>{payment.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="requests-section">
      <div className="section-header">
        <h3>Payment Requests</h3>
        <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
          + New Request
        </button>
      </div>
      
      {paymentRequests.length > 0 ? (
        <div className="requests-list">
          {paymentRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-amount">${request.amount}</div>
                <div className={`status-badge ${request.status}`}>{request.status}</div>
              </div>
              <div className="request-content">
                <div className="request-reason">{request.reason}</div>
                <div className="request-date">Submitted on {request.date}</div>
              </div>
              <div className="request-actions">
                <button className="btn-secondary">Edit</button>
                <button className="btn-danger">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h4>No Payment Requests</h4>
          <p>You haven't submitted any payment requests yet.</p>
          <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
            Create Your First Request
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {userProfile?.employeeName}</h1>
          <p>Employee Dashboard</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">{userProfile?.employeeName}</span>
              <span className="user-email">{userProfile?.email}</span>
            </div>
          </div>
          <button onClick={signOut} className="sign-out-btn">Sign Out</button>
        </div>
      </div>
      
      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💳 Payments
        </button>
        <button 
          className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📝 Requests
        </button>
        <button 
          className={`nav-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          👛 Wallet
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'wallet' && (
          <div className="wallet-section">
            <h3>Wallet Management</h3>
            <p>Wallet features and integrations coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <p>Privacy settings and preferences coming soon...</p>
          </div>
        )}
      </div>

      {/* Payment Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Payment</h3>
              <button className="modal-close" onClick={() => setShowRequestModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Request Type</label>
                <select>
                  <option>Expense Reimbursement</option>
                  <option>Advance Payment</option>
                  <option>Bonus Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount (USD)</label>
                <input type="number" placeholder="Enter amount" />
              </div>
              <div className="form-group">
                <label>Reason/Description</label>
                <textarea rows={3} placeholder="Explain the reason for this payment request"></textarea>
              </div>
              <div className="form-group">
                <label>Supporting Documents</label>
                <input type="file" multiple />
                <small>Upload receipts, invoices, or other supporting documents</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
              <button className="btn-primary">Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Payment Modal */}
      {showSendModal && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Payment</h3>
              <button className="modal-close" onClick={() => setShowSendModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Recipient</label>
                <input type="text" placeholder="Enter wallet address or email" />
              </div>
              <div className="form-group">
                <label>Amount (USD)</label>
                <input type="number" placeholder="Enter amount" />
                <small>Available balance: $8,749.50</small>
              </div>
              <div className="form-group">
                <label>Privacy Settings</label>
                <div className="privacy-options">
                  <label>
                    <input type="radio" name="privacy" value="private" defaultChecked />
                    🔒 Private Transaction (recommended)
                  </label>
                  <label>
                    <input type="radio" name="privacy" value="public" />
                    👁️ Public Transaction
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Note (Optional)</label>
                <input type="text" placeholder="Add a note for this payment" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSendModal(false)}>Cancel</button>
              <button className="btn-primary">Send Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard; 