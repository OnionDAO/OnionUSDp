import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

// Solana wallet type declarations
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
    };
  }
}

interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  position: string;
  status: 'active' | 'inactive';
  dateAdded: string;
}

interface Transaction {
  id: string;
  type: 'payroll' | 'bonus' | 'transfer';
  recipient: string;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  txHash?: string;
}

interface CompanyWallet {
  address: string;
  balance: string;
  network: string;
  isConnected: boolean;
}

type TabType = 'overview' | 'employees' | 'treasury' | 'transactions';

const CorporationDashboard: React.FC = () => {
  const { userProfile, walletInfo, connectWallet, disconnectWallet, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  
  // Form states
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    position: '',
    walletAddress: ''
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'employees', label: 'Employee Registry', icon: 'people' },
    { id: 'treasury', label: 'Payroll Treasury', icon: 'account_balance' },
    { id: 'transactions', label: 'Payment History', icon: 'receipt_long' }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedEmployees = localStorage.getItem('onion_corp_employees');
    const savedTransactions = localStorage.getItem('onion_corp_transactions');
    
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    }
    
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setWalletError(null);
    
    try {
      await connectWallet();
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setWalletError(error.message || 'Failed to connect wallet. Please try again.');
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

  const addEmployee = () => {
    if (!employeeFormData.name || !employeeFormData.email || !employeeFormData.position) {
      alert('Please fill in all required fields');
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: employeeFormData.name,
      email: employeeFormData.email,
      position: employeeFormData.position,
      walletAddress: employeeFormData.walletAddress || undefined,
      status: 'active',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem('onion_corp_employees', JSON.stringify(updatedEmployees));
    
    // Reset form
    setEmployeeFormData({
      name: '',
      email: '',
      position: '',
      walletAddress: ''
    });
    setIsAddEmployeeModalOpen(false);
  };

  const renderTabContent = () => {
    if (!walletInfo?.connected) {
      return null;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            {/* Treasury Status */}
            <div className="treasury-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">account_balance</span>
                  Corporate Treasury
                </div>
                <div className="card-status status-active">SECURED</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Wallet Address:</span>
                  <span className="tx-address">{walletInfo.address}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Network:</span>
                  <span className="tx-value">Solana Mainnet</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Last Connected:</span>
                  <span className="tx-value">
                    {new Date(walletInfo.lastConnected).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Metrics */}
            <div className="metrics-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">analytics</span>
                  Company Metrics
                </div>
                <div className="card-status status-enhanced">OPERATIONAL</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Active Employees:</span>
                  <span className="tx-value">{employees.filter(e => e.status === 'active').length}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Total Employees:</span>
                  <span className="tx-value">{employees.length}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Total Transactions:</span>
                  <span className="tx-value">{transactions.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-grid">
              <div className="action-card" onClick={() => setActiveTab('employees')}>
                <div className="action-icon">people</div>
                <div className="action-content">
                  <h4>Employee Registry</h4>
                  <p>Manage employee accounts for confidential payroll</p>
                </div>
              </div>
              
              <div className="action-card" onClick={() => setActiveTab('treasury')}>
                <div className="action-icon">account_balance</div>
                <div className="action-content">
                  <h4>Payroll Treasury</h4>
                  <p>Manage corporate funds for employee payments</p>
                </div>
              </div>
              
              <div className="action-card" onClick={() => setActiveTab('transactions')}>
                <div className="action-icon">receipt_long</div>
                <div className="action-content">
                  <h4>Payment History</h4>
                  <p>View confidential payroll transaction records</p>
                </div>
              </div>
              
              <div className="action-card">
                <div className="action-icon">analytics</div>
                <div className="action-content">
                  <h4>Payroll Reports</h4>
                  <p>Generate compliance and audit reports</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'employees':
        return (
          <div className="employees-content">
            <div className="section-header">
              <h3>Employee Registry</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsAddEmployeeModalOpen(true)}
              >
                <span className="material-icons">add</span>
                Add Employee
              </button>
            </div>
            
            {employees.length === 0 ? (
              <div className="empty-employees">
                <div className="empty-icon">
                  <span className="material-icons">people</span>
                </div>
                <h3>No Employees Registered</h3>
                <p>Register employees to begin processing confidential salary payments. Only registered employees can receive payments from this corporate treasury.</p>
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                >
                  <span className="material-icons">add</span>
                  Add First Employee
                </button>
              </div>
            ) : (
              <div className="employees-list">
                {employees.map((employee) => (
                  <div key={employee.id} className="employee-card">
                    <div className="employee-header">
                      <div className="employee-info">
                        <h4>{employee.name}</h4>
                        <p>{employee.position}</p>
                        <span className="employee-email">{employee.email}</span>
                      </div>
                      <div className={`employee-status ${employee.status}`}>
                        {employee.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="employee-content">
                      <div className="transaction-row">
                        <span className="tx-label">Wallet Address:</span>
                        <span className="tx-value">
                          {employee.walletAddress ? (
                            <span className="tx-address">{employee.walletAddress}</span>
                          ) : (
                            <span className="tx-value pending">Not Connected</span>
                          )}
                        </span>
                      </div>
                      <div className="transaction-row">
                        <span className="tx-label">Date Added:</span>
                        <span className="tx-value">{employee.dateAdded}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'treasury':
        return (
          <div className="treasury-content">
            <div className="section-header">
              <h3>Payroll Treasury</h3>
            </div>
            
            <div className="treasury-overview">
              <div className="treasury-balance-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="material-icons">account_balance_wallet</span>
                    Corporate Wallet
                  </div>
                  <div className="card-status status-private">CONFIDENTIAL</div>
                </div>
                <div className="card-content">
                  <div className="balance-display">
                    <p>Connected to Solana network with confidential transfer capabilities</p>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Address:</span>
                    <span className="tx-address">{walletInfo.address}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Status:</span>
                    <span className="tx-value private">🔒 Ready for Confidential Transactions</span>
                  </div>
                </div>
              </div>
              
              <div className="treasury-actions">
                <button className="btn btn-primary">
                  <span className="material-icons">add</span>
                  Deposit Funds
                </button>
                <button className="btn btn-secondary">
                  <span className="material-icons">send</span>
                  Transfer Funds
                </button>
                <button className="btn btn-secondary">
                  <span className="material-icons">assessment</span>
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="transactions-content">
            <div className="section-header">
              <h3>Employee Payment History</h3>
              <div className="header-actions">
                <select className="filter-select">
                  <option>All Payments</option>
                  <option>Salary Payments</option>
                  <option>Bonus Payments</option>
                  <option>Pending Payments</option>
                </select>
                <button className="btn btn-secondary btn-small">
                  <span className="material-icons">download</span>
                  Export
                </button>
              </div>
            </div>
            
            {transactions.length === 0 ? (
              <div className="empty-transactions">
                <div className="empty-icon">
                  <span className="material-icons">receipt_long</span>
                </div>
                <h3>No Payment History</h3>
                <p>Employee payment records will appear here once you begin processing confidential salary payments to registered employees.</p>
              </div>
            ) : (
              <div className="transactions-list">
                {transactions.map((transaction) => (
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
                        <span className="tx-label">Recipient:</span>
                        <span className="tx-value">{transaction.recipient}</span>
                      </div>
                      <div className="transaction-row">
                        <span className="tx-label">Date:</span>
                        <span className="tx-value">{transaction.date}</span>
                      </div>
                      {transaction.txHash && (
                        <div className="transaction-row">
                          <span className="tx-label">Transaction:</span>
                          <span className="tx-address">{transaction.txHash}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            Connecting to corporate banking...
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
              <span className="badge-text">Corporate Treasury</span>
            </div>
            <button className="btn btn-secondary btn-small logout-btn" onClick={handleLogout}>
              <span className="material-icons">logout</span>
              Sign Out
            </button>
          </div>
          <h1 className="dashboard-title">
            {userProfile?.companyName || 'Corporate'} Payroll Center
          </h1>
          <p className="dashboard-subtitle">
            Confidential employee payroll management and treasury operations
          </p>
        </div>

        {/* Wallet Connection Error */}
        {walletError && (
          <div className="error-card">
            <div className="card-header">
              <div className="card-title">
                <span className="material-icons">warning</span>
                Connection Issue
              </div>
            </div>
            <div className="card-content">
              <p>{walletError}</p>
              <div className="error-actions">
                <button className="btn btn-primary btn-small" onClick={handleConnectWallet}>
                  <span className="material-icons">refresh</span>
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection */}
        {!walletError && !walletInfo?.connected ? (
          <div className="connect-card">
            <div className="card-header">
              <div className="card-title">
                <span className="material-icons">account_balance_wallet</span>
                Connect Corporate Wallet
              </div>
            </div>
            <div className="card-content">
              <p>Connect your authorized corporate wallet to access treasury operations and manage confidential employee salary payments.</p>
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
        ) : walletInfo?.connected && (
          <>
            {/* Wallet Connected Info */}
            <div className="connect-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">check_circle</span>
                  Wallet Connected
                </div>
                <button 
                  className="btn btn-secondary btn-small" 
                  onClick={handleDisconnectWallet}
                >
                  <span className="material-icons">link_off</span>
                  Disconnect
                </button>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Address:</span>
                  <span className="tx-address">{walletInfo.address}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Status:</span>
                  <span className="tx-value private">🔒 Ready for Confidential Transactions</span>
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

        {/* Add Employee Modal */}
        {isAddEmployeeModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddEmployeeModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add Employee</h3>
                <button 
                  className="modal-close"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Employee Name *</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={employeeFormData.name}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email"
                    className="form-input"
                    value={employeeFormData.email}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Position *</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={employeeFormData.position}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, position: e.target.value})}
                    placeholder="Enter job title"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Wallet Address (Optional)</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={employeeFormData.walletAddress}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, walletAddress: e.target.value})}
                    placeholder="Solana wallet address (can be added later)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={addEmployee}
                >
                  <span className="material-icons">add</span>
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporationDashboard; 