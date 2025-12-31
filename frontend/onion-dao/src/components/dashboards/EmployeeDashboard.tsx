import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService, employeeService } from '../../services/firestoreService';
import type { Transaction, Employee } from '../../types';
import { getNetworkInfo } from '../../services/solanaPayService';
import './Dashboard.css';

type TabType = 'overview' | 'transactions' | 'security';

const EmployeeDashboard: React.FC = () => {
  const { userProfile, walletInfo, isWalletConnected, connectWallet, disconnectWallet, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employeeRecord, setEmployeeRecord] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  // Get network info for display
  const networkInfo = getNetworkInfo();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'transactions', label: 'Payments Received', icon: 'receipt_long' },
    { id: 'security', label: 'Security', icon: 'security' }
  ];

  // Load employee data and transactions from Firebase
  useEffect(() => {
    const loadEmployeeData = async () => {
      if (userProfile?.uid && userProfile.userType === 'employee') {
        try {
          // Find employee record by email
          const employees = await employeeService.getEmployeesByCorporation(userProfile.corporationId || '');
          const employee = employees.find(emp => emp.email === userProfile.email);
          setEmployeeRecord(employee || null);
          
          // Load transactions for this employee
          if (employee) {
            const employeeTransactions = await transactionService.getTransactionsForEmployee(employee.id);
            setTransactions(employeeTransactions);
          }
        } catch (error) {
          console.error('Error loading employee data from Firebase:', error);
        }
      }
    };
    
    loadEmployeeData();
  }, [userProfile]);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setWalletError(null);
    
    try {
      await connectWallet();
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      if (error.code === 4001) {
        setWalletError('Connection cancelled. Please try again and approve the connection.');
      } else if (error.message?.includes('User rejected')) {
        setWalletError('Connection rejected. Please approve the wallet connection to continue.');
      } else {
        setWalletError(error.message || 'Failed to connect to wallet. Please make sure your wallet is unlocked and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter and search transactions
  const getFilteredTransactions = useCallback(() => {
    let filtered = transactions;

    // Apply type filter
    switch (transactionFilter) {
      case 'salary':
        filtered = filtered.filter(t => t.type === 'salary');
        break;
      case 'bonus':
        filtered = filtered.filter(t => t.type === 'bonus');
        break;
      case 'pending':
        filtered = filtered.filter(t => t.status === 'pending');
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.type.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query) ||
        (t.signature && t.signature.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [transactions, transactionFilter, searchQuery]);

  // Export transactions to CSV
  const handleExportTransactions = useCallback(() => {
    const filteredTxs = getFilteredTransactions();
    if (filteredTxs.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['Date', 'Type', 'Amount', 'Status', 'Transaction ID'];
    const csvContent = [
      headers.join(','),
      ...filteredTxs.map(tx => [
        formatDate(tx.date),
        tx.type,
        tx.private ? 'Confidential' : tx.amount || 0,
        tx.status,
        tx.signature || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `my_payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [getFilteredTransactions]);

  const renderTabContent = () => {
    if (!isWalletConnected) {
      return null;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            {/* Account Balance Card */}
            <div className="balance-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">account_balance_wallet</span>
                  Employee Wallet
                </div>
                <div className="card-status status-private">RECEIVE ONLY</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Wallet Address:</span>
                  <span className="tx-address">{walletInfo?.address}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Network:</span>
                  <span className="tx-value">
                    Solana {networkInfo.isDevnet ? 'Devnet' : 'Mainnet'}
                    {networkInfo.isDevnet && <span className="badge badge-warning" style={{marginLeft: '8px', fontSize: '10px'}}>DEMO</span>}
                  </span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Last Connected:</span>
                  <span className="tx-value">
                    {walletInfo?.lastConnected ? new Date(walletInfo.lastConnected).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Status Card */}
            <div className="privacy-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">privacy_tip</span>
                  Payment Privacy
                </div>
                <div className="card-status status-enhanced">PROTECTED</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Salary Privacy:</span>
                  <span className="tx-value private">🔒 Confidential</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Compliance:</span>
                  <span className="tx-value private">✅ Maintained</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Account Type:</span>
                  <span className="tx-value private">📥 Receive Only</span>
                </div>
              </div>
            </div>

            {/* Employee Notice */}
            <div className="privacy-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">info</span>
                  Account Information
                </div>
                <div className="card-status status-active">ACTIVE</div>
              </div>
              <div className="card-content">
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  This is an employee account configured to receive confidential salary payments from authorized organizations. 
                  You cannot send payments from this account - only receive them from your employer or other authorized entities.
                </p>
              </div>
            </div>

            {/* Stats Bottom */}
            <div className="stats-bottom">
              <div className="stat-item">
                <div className="stat-value">{transactions.length}</div>
                <div className="stat-label">PAYMENTS RECEIVED</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">PAYMENT PRIVACY</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$0.00</div>
                <div className="stat-label">TRANSACTION FEES</div>
              </div>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="transactions-content">
            <div className="section-header">
              <h3>Payments Received</h3>
              <div className="header-actions">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="filter-select"
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="salary">Salary</option>
                  <option value="bonus">Bonus</option>
                  <option value="pending">Pending</option>
                </select>
                <button className="btn btn-secondary btn-small" onClick={handleExportTransactions}>
                  <span className="material-icons">download</span>
                  Export
                </button>
              </div>
            </div>

            {getFilteredTransactions().length === 0 ? (
              <div className="empty-transactions">
                <div className="empty-icon">
                  <span className="material-icons">{transactions.length === 0 ? 'payment' : 'search_off'}</span>
                </div>
                <h3>{transactions.length === 0 ? 'No Payments Received' : 'No Matching Payments'}</h3>
                <p>
                  {transactions.length === 0
                    ? 'Your confidential salary and bonus payments from authorized organizations will appear here. All payments are protected with enterprise-grade privacy using OnionUSD-P confidential transfers.'
                    : `No payments match your current filter "${transactionFilter}" ${searchQuery ? `or search "${searchQuery}"` : ''}. Try adjusting your filters.`
                  }
                </p>
                {transactions.length === 0 && (
                  <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', margin: 0 }}>
                      <strong>Note:</strong> This is a receive-only account. You cannot send payments from this wallet.
                    </p>
                  </div>
                )}
                {transactions.length > 0 && (
                  <button
                    className="btn btn-secondary btn-small"
                    style={{ marginTop: 'var(--space-4)' }}
                    onClick={() => { setSearchQuery(''); setTransactionFilter('all'); }}
                  >
                    <span className="material-icons">clear_all</span>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="transactions-list">
                {getFilteredTransactions().map((transaction) => (
                  <div key={transaction.id} className="transaction-card">
                    <div className="transaction-header">
                      <div className="transaction-type">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Payment
                      </div>
                      <div className={`transaction-status ${transaction.status}`}>
                        {transaction.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="transaction-content">
                      <div className="transaction-row">
                        <span className="tx-label">Date:</span>
                        <span className="tx-value">{formatDate(transaction.date)}</span>
                      </div>
                      <div className="transaction-row">
                        <span className="tx-label">Type:</span>
                        <span className="tx-value">{transaction.type} Payment</span>
                      </div>
                      <div className="transaction-row">
                        <span className="tx-label">Amount:</span>
                        <span className="tx-value private">
                          {transaction.private ? '🔒 Confidential' : `$${transaction.amount.toLocaleString()}`}
                        </span>
                      </div>
                      {transaction.signature && (
                        <div className="transaction-row">
                          <span className="tx-label">Transaction:</span>
                          <span className="tx-address">{transaction.signature}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="security-content">
            <div className="section-header">
              <h3>Security & Privacy Settings</h3>
            </div>
            
            <div className="security-cards">
              <div className="security-feature-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="material-icons">verified_user</span>
                    Confidential Transfers
                  </div>
                  <div className="card-status status-active">ACTIVE</div>
                </div>
                <div className="card-content">
                  <p>All salary payments are protected using OnionUSD-P confidential transfers with zero-knowledge proofs. Payment amounts remain completely private while maintaining regulatory compliance.</p>
                </div>
              </div>

              <div className="security-feature-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="material-icons">lock</span>
                    Receive-Only Security
                  </div>
                  <div className="card-status status-active">ENFORCED</div>
                </div>
                <div className="card-content">
                  <p>This account is configured as receive-only for enhanced security. You cannot send payments, reducing the risk of unauthorized transactions or account compromise.</p>
                </div>
              </div>

              <div className="security-feature-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="material-icons">phonelink_lock</span>
                    Two-Factor Authentication
                  </div>
                  <div className="card-status status-inactive">INACTIVE</div>
                </div>
                <div className="card-content">
                  <p>Add an extra layer of security to your account with SMS or authenticator app verification for accessing payment history.</p>
                  <button className="btn btn-secondary btn-small" onClick={() => setIs2FAModalOpen(true)}>
                    <span className="material-icons">add</span>
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="security-feature-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="material-icons">person</span>
                    Account Information
                  </div>
                </div>
                <div className="card-content">
                  <div className="transaction-row">
                    <span className="tx-label">Employee Name:</span>
                    <span className="tx-value">{employeeRecord?.name || userProfile?.employeeName || 'Not set'}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Department:</span>
                    <span className="tx-value">{employeeRecord?.department || 'Not set'}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Employee Status:</span>
                    <span className="tx-value">{employeeRecord?.status || 'Unknown'}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Account Type:</span>
                    <span className="tx-value">Employee (Receive Only)</span>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Email Notifications:</span>
                    <span className="tx-value">✅ Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="loading">
            <div className="spinner"></div>
            Connecting to secure banking...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-top">
            <div className="header-badge">
              <span className="badge-text">Employee Banking Portal</span>
            </div>
            <button 
              className="btn btn-secondary btn-small logout-btn" 
              onClick={handleLogout}
              title="Sign out (wallet will be saved for next login)"
            >
              <span className="material-icons">logout</span>
              Sign Out
            </button>
          </div>
          <h1 className="dashboard-title">
            Employee Payment Account
          </h1>
          <p className="dashboard-subtitle">
            Secure receipt of confidential salary payments with OnionUSD-P
          </p>
        </div>

        {/* Wallet Connection Error */}
        {walletError && (
          <div className="error-card">
            <div className="card-header">
              <div className="card-title">
                <span className="material-icons">warning</span>
                Wallet Connection Issue
              </div>
            </div>
            <div className="card-content">
              <p>{walletError}</p>
              <div className="error-actions">
                <button 
                  className="btn btn-secondary btn-small" 
                  onClick={() => window.open('https://phantom.app/', '_blank')}
                >
                  <span className="material-icons">download</span>
                  Install Phantom
                </button>
                <button className="btn btn-primary btn-small" onClick={handleConnectWallet}>
                  <span className="material-icons">refresh</span>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection */}
        {!walletError && !isWalletConnected ? (
          <div className="connect-card">
            <div className="card-header">
              <div className="card-title">
                <span className="material-icons">account_balance_wallet</span>
                Connect Employee Wallet
              </div>
            </div>
            <div className="card-content">
              <p>Connect your Solana wallet to receive confidential salary payments from authorized organizations using OnionUSD-P.</p>
              <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-3)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', margin: 0 }}>
                  <strong>Note:</strong> This will be configured as a receive-only account for security.
                </p>
              </div>
              <div className="connect-actions">
                <button className="btn btn-primary btn-large" onClick={handleConnectWallet}>
                  <span className="material-icons">link</span>
                  Connect Wallet
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.open('https://phantom.app/', '_blank')}
                >
                  <span className="material-icons">download</span>
                  Get Phantom Wallet
                </button>
              </div>
            </div>
          </div>
        ) : isWalletConnected && (
          <>
            {/* Wallet Connected Info */}
            <div className="connect-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">check_circle</span>
                  Wallet Connected & Saved
                </div>
                <button 
                  className="btn btn-secondary btn-small" 
                  onClick={handleDisconnectWallet}
                  title="Permanently disconnect and forget this wallet"
                >
                  <span className="material-icons">link_off</span>
                  Forget Wallet
                </button>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Address:</span>
                  <span className="tx-address">{walletInfo?.address}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Status:</span>
                  <span className="tx-value private">📥 Ready to Receive</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Auto-Login:</span>
                  <span className="tx-value private">✅ Enabled</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="professional-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                >
                  <span className="material-icons tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content-area">
              {renderTabContent()}
            </div>
          </>
        )}

        {/* 2FA Modal */}
        {is2FAModalOpen && (
          <div className="modal-overlay" onClick={() => setIs2FAModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Enable Two-Factor Authentication</h2>
                <button className="modal-close" onClick={() => setIs2FAModalOpen(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="two-fa-options">
                  <div className="two-fa-option">
                    <div className="option-icon">
                      <span className="material-icons">smartphone</span>
                    </div>
                    <div className="option-content">
                      <h4>Authenticator App</h4>
                      <p>Use Google Authenticator, Authy, or similar apps for secure time-based codes.</p>
                      <button className="btn btn-primary btn-small">
                        <span className="material-icons">qr_code</span>
                        Set Up Authenticator
                      </button>
                    </div>
                  </div>
                  <div className="two-fa-option">
                    <div className="option-icon">
                      <span className="material-icons">sms</span>
                    </div>
                    <div className="option-content">
                      <h4>SMS Verification</h4>
                      <p>Receive verification codes via text message to your registered phone number.</p>
                      <button className="btn btn-secondary btn-small">
                        <span className="material-icons">phone</span>
                        Set Up SMS
                      </button>
                    </div>
                  </div>
                </div>
                <div className="demo-notice" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', margin: 0 }}>
                    <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>info</span>
                    <strong>Demo Mode:</strong> 2FA setup is simulated in this demo environment. In production, this would integrate with Firebase Authentication or a similar service.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIs2FAModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard; 