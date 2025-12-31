import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService, transactionService } from '../../services/firestoreService';
import type { Employee, Transaction } from '../../types';
import SolanaPayDashboard from '../SolanaPayDashboard';
import { getNetworkInfo } from '../../services/solanaPayService';
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

type TabType = 'overview' | 'employees' | 'treasury' | 'transactions' | 'solana-pay';

const CorporationDashboard: React.FC = () => {
  const { userProfile, walletInfo, isWalletConnected, connectWallet, disconnectWallet, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  
  // Form states
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    department: '',
    salary: 0,
    walletAddress: ''
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get network info for display
  const networkInfo = getNetworkInfo();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard', description: 'Company metrics & quick actions' },
    { id: 'employees', label: 'Employee Registry', icon: 'people', description: 'Manage registered employees' },
    { id: 'treasury', label: 'Payroll Treasury', icon: 'account_balance', description: 'Corporate wallet management' },
    { id: 'transactions', label: 'Payment History', icon: 'receipt_long', description: 'View transaction records' },
    { id: 'solana-pay', label: 'Solana Pay', icon: 'qr_code', description: 'Generate payment QR codes' }
  ];

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (userProfile?.uid && userProfile.userType === 'corporation') {
        setIsDataLoading(true);
        try {
          // Load employees and transactions in parallel
          const [corporationEmployees, corporationTransactions] = await Promise.all([
            employeeService.getEmployeesByCorporation(userProfile.uid),
            transactionService.getTransactionsByCorporation(userProfile.uid)
          ]);
          
          setEmployees(corporationEmployees);
          setTransactions(corporationTransactions);
        } catch (error) {
          console.error('Error loading data from Firebase:', error);
        } finally {
          setIsDataLoading(false);
        }
      }
    };
    
    loadData();
  }, [userProfile]);

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

  const addEmployee = async () => {
    console.log('🚀 Starting employee creation...');
    console.log('📋 Form data:', employeeFormData);
    console.log('👤 User profile:', userProfile);

    if (!employeeFormData.name || !employeeFormData.email || !employeeFormData.department || !employeeFormData.salary) {
      console.error('❌ Missing required fields');
      setSubmitError('Please fill in all required fields');
      return;
    }

    // Validate wallet address if provided
    if (employeeFormData.walletAddress && employeeFormData.walletAddress.trim()) {
      const walletAddress = employeeFormData.walletAddress.trim();
      // Basic Solana address validation: should be 32-44 characters, base58 encoded
      if (walletAddress.length < 32 || walletAddress.length > 44) {
        console.error('❌ Invalid wallet address length');
        setSubmitError('Wallet address must be between 32-44 characters. Leave blank if unknown.');
        return;
      }
      // Check for invalid characters (basic validation)
      if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(walletAddress)) {
        console.error('❌ Invalid wallet address format');
        setSubmitError('Invalid wallet address format. Use a valid Solana address or leave blank.');
        return;
      }
    }

    if (!userProfile?.uid) {
      console.error('❌ No user profile or UID found');
      console.log('Current userProfile:', userProfile);
      setSubmitError('User profile not found. Please log out and log back in.');
      return;
    }

    if (userProfile.userType !== 'corporation') {
      console.error('❌ User is not a corporation');
      setSubmitError('Only corporations can add employees. Please ensure you are logged in as a corporation.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const employeeData = {
        name: employeeFormData.name,
        email: employeeFormData.email,
        walletAddress: employeeFormData.walletAddress || '',
        corporationId: userProfile.uid,
        department: employeeFormData.department,
        salary: employeeFormData.salary,
        status: 'active' as const
      };

      console.log('📤 Sending employee data to Firebase:', employeeData);
      const employeeId = await employeeService.createEmployee(employeeData);
      console.log('✅ Employee created with ID:', employeeId);
      
      // Reload employees from Firebase
      console.log('🔄 Reloading employees...');
      const updatedEmployees = await employeeService.getEmployeesByCorporation(userProfile.uid);
      setEmployees(updatedEmployees);
      console.log('✅ Employees reloaded:', updatedEmployees.length, 'total');
      
      // Reset form
      setEmployeeFormData({
        name: '',
        email: '',
        department: '',
        salary: 0,
        walletAddress: ''
      });
      setIsAddEmployeeModalOpen(false);
      
      console.log('🎉 Employee added successfully with ID:', employeeId);
    } catch (error) {
      console.error('💥 Detailed error adding employee:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to add employee. ';
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          errorMessage += 'Permission denied. Please check your Firebase configuration.';
        } else if (error.message.includes('network')) {
          errorMessage += 'Network error. Please check your internet connection.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Please try again.';
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculatePayrollMetrics = () => {
    const activeEmployees = employees.filter(e => e.status === 'active');
    const totalSalaries = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    const avgSalary = activeEmployees.length > 0 ? totalSalaries / activeEmployees.length : 0;

    return {
      activeEmployees: activeEmployees.length,
      totalEmployees: employees.length,
      totalMonthlyPayroll: totalSalaries,
      avgSalary,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      completedTransactions: transactions.filter(t => t.status === 'completed').length,
    };
  };

  // Filter transactions based on selected filter
  const getFilteredTransactions = useCallback(() => {
    switch (transactionFilter) {
      case 'salary':
        return transactions.filter(t => t.type === 'salary');
      case 'bonus':
        return transactions.filter(t => t.type === 'bonus');
      case 'pending':
        return transactions.filter(t => t.status === 'pending');
      default:
        return transactions;
    }
  }, [transactions, transactionFilter]);

  // Export transactions to CSV
  const handleExportTransactions = useCallback(() => {
    const filteredTxs = getFilteredTransactions();
    if (filteredTxs.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['Date', 'Type', 'Recipient', 'Amount', 'Status', 'Transaction ID'];
    const csvContent = [
      headers.join(','),
      ...filteredTxs.map(tx => [
        typeof tx.date === 'string' ? tx.date : formatDate(tx.date),
        tx.type,
        tx.recipient,
        tx.amount || 0,
        tx.status,
        tx.signature || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [getFilteredTransactions]);

  // Handle deposit button click
  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  // Handle generate report click
  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
  };

  // Handle compliance reports click
  const handleComplianceClick = () => {
    setIsComplianceModalOpen(true);
  };

  // Handle privacy settings click
  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  // Open setup guide (external link or modal)
  const handleSetupGuide = () => {
    window.open('https://phantom.app/download', '_blank');
  };

  const renderWalletConnectCard = () => (
    <div className="connect-card">
      <div className="card-content">
        <div className="card-title">
          <span className="material-icons">account_balance_wallet</span>
          Connect Corporate Wallet
        </div>
        <p>
          Connect your Solana wallet to access treasury management, employee payments, 
          and confidential transaction capabilities. Your wallet will be used for all 
          corporate payroll operations.
        </p>
        
        {walletError && (
          <div className="modal-error">
            <span className="material-icons">error</span>
            {walletError}
          </div>
        )}
        
        <div className="connect-actions">
          <button 
            className="btn btn-primary btn-large" 
            onClick={handleConnectWallet}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Connecting...
              </>
            ) : (
              <>
                <span className="material-icons">wallet</span>
                Connect Phantom Wallet
              </>
            )}
          </button>
          
          <button className="btn btn-secondary" onClick={handleSetupGuide}>
            <span className="material-icons">help</span>
            Setup Guide
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (!isWalletConnected) {
      return renderWalletConnectCard();
    }

    if (isDataLoading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    const metrics = calculatePayrollMetrics();

    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            {/* Enhanced Treasury Status */}
            <div className="treasury-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">account_balance</span>
                  Corporate Treasury
                </div>
                <div className="card-status status-secured">SECURED</div>
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
                  <span className="tx-label">Security Level:</span>
                  <span className="tx-value private">🔒 Confidential Transfers Enabled</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Last Connected:</span>
                  <span className="tx-value">
                    {walletInfo?.lastConnected ? formatDate(new Date(walletInfo.lastConnected)) : 'Just now'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Company Metrics */}
            <div className="metrics-card">
              <div className="card-header">
                <div className="card-title">
                  <span className="material-icons">analytics</span>
                  Payroll Analytics
                </div>
                <div className="card-status status-operational">OPERATIONAL</div>
              </div>
              <div className="card-content">
                <div className="transaction-row">
                  <span className="tx-label">Active Employees:</span>
                  <span className="tx-value">{metrics.activeEmployees}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Monthly Payroll:</span>
                  <span className="tx-value">{formatCurrency(metrics.totalMonthlyPayroll)}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Average Salary:</span>
                  <span className="tx-value">{formatCurrency(metrics.avgSalary)}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Total Transactions:</span>
                  <span className="tx-value">{transactions.length}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Pending Payments:</span>
                  <span className="tx-value pending">{metrics.pendingTransactions}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="actions-grid">
              <div className="action-card" onClick={() => setActiveTab('employees')}>
                <div className="action-icon">people</div>
                <div className="action-content">
                  <h4>Employee Registry</h4>
                  <p>Manage employee accounts for confidential payroll processing</p>
                </div>
              </div>
              
              <div className="action-card" onClick={() => setActiveTab('treasury')}>
                <div className="action-icon">account_balance</div>
                <div className="action-content">
                  <h4>Treasury Management</h4>
                  <p>Manage corporate funds and payroll treasury operations</p>
                </div>
              </div>
              
              <div className="action-card" onClick={() => setActiveTab('solana-pay')}>
                <div className="action-icon">qr_code</div>
                <div className="action-content">
                  <h4>Instant Payments</h4>
                  <p>Generate QR codes for immediate employee payments</p>
                </div>
              </div>
              
              <div className="action-card" onClick={() => setActiveTab('transactions')}>
                <div className="action-icon">receipt_long</div>
                <div className="action-content">
                  <h4>Payment History</h4>
                  <p>View comprehensive payroll transaction records</p>
                </div>
              </div>
              
              <div className="action-card" onClick={handleComplianceClick}>
                <div className="action-icon">assessment</div>
                <div className="action-content">
                  <h4>Compliance Reports</h4>
                  <p>Generate payroll reports for audit and compliance</p>
                </div>
              </div>

              <div className="action-card" onClick={handlePrivacyClick}>
                <div className="action-icon">security</div>
                <div className="action-content">
                  <h4>Privacy Settings</h4>
                  <p>Configure confidential transaction parameters</p>
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
              <div className="header-actions">
                <div className="header-stats">
                  <span className="badge badge-primary">
                    {metrics.activeEmployees} Active
                  </span>
                  <span className="badge badge-secondary">
                    {metrics.totalEmployees} Total
                  </span>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                >
                  <span className="material-icons">add</span>
                  Add Employee
                </button>
              </div>
            </div>
            
            {employees.length === 0 ? (
              <div className="empty-employees">
                <div className="empty-icon">
                  <span className="material-icons">people</span>
                </div>
                <h3>No Employees Registered</h3>
                <p>
                  Start building your payroll registry by adding employees. Each registered 
                  employee can receive confidential salary payments through your corporate treasury.
                </p>
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
                {employees.map((employee, index) => (
                  <div key={employee.id} className="employee-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="employee-header">
                      <div className="employee-info">
                        <h4>{employee.name}</h4>
                        <p>{employee.department}</p>
                        <span className="employee-email">{employee.email}</span>
                      </div>
                      <div className={`employee-status ${employee.status}`}>
                        {employee.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="employee-content">
                      <div className="transaction-row">
                        <span className="tx-label">Annual Salary:</span>
                        <span className="tx-value">{formatCurrency(employee.salary)}</span>
                      </div>
                      <div className="transaction-row">
                        <span className="tx-label">Monthly Payment:</span>
                        <span className="tx-value">{formatCurrency(employee.salary / 12)}</span>
                      </div>
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
                        <span className="tx-value">{formatDate(employee.createdAt)}</span>
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
              <h3>Corporate Treasury</h3>
              <div className="header-actions">
                <span className="badge badge-success">Connected</span>
                <button className="btn btn-secondary btn-small" onClick={handleDisconnectWallet}>
                  <span className="material-icons">logout</span>
                  Disconnect
                </button>
              </div>
            </div>
            
            <div className="treasury-overview">
              <div className="treasury-balance-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="material-icons">account_balance_wallet</span>
                    Corporate Wallet
                  </div>
                  <div className="card-status status-confidential">CONFIDENTIAL</div>
                </div>
                <div className="card-content">
                  <div className="balance-display">
                    <p>
                      Your corporate wallet is connected and ready for confidential payroll operations. 
                      All employee payments will be processed through this secure treasury account.
                    </p>
                  </div>
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
                    <span className="tx-label">Security Features:</span>
                    <span className="tx-value private">🔒 Confidential Transfers Enabled</span>
                  </div>
                  <div className="transaction-row">
                    <span className="tx-label">Monthly Payroll:</span>
                    <span className="tx-value">{formatCurrency(metrics.totalMonthlyPayroll)}</span>
                  </div>
                </div>
              </div>
              
              <div className="treasury-actions">
                <button className="btn btn-primary btn-large" onClick={handleDepositClick}>
                  <span className="material-icons">add_circle</span>
                  Deposit Funds
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveTab('solana-pay')}>
                  <span className="material-icons">send</span>
                  Transfer Funds
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveTab('transactions')}>
                  <span className="material-icons">history</span>
                  Transaction History
                </button>
                <button className="btn btn-secondary" onClick={handleGenerateReport}>
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
              <h3>Payment History</h3>
              <div className="header-actions">
                <div className="header-stats">
                  <span className="badge badge-success">
                    {metrics.completedTransactions} Completed
                  </span>
                  <span className="badge badge-warning">
                    {metrics.pendingTransactions} Pending
                  </span>
                </div>
                <select
                  className="filter-select"
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="salary">Salary Payments</option>
                  <option value="bonus">Bonus Payments</option>
                  <option value="pending">Pending Payments</option>
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
                  <span className="material-icons">receipt_long</span>
                </div>
                <h3>{transactions.length === 0 ? 'No Payment History' : 'No Matching Payments'}</h3>
                <p>
                  {transactions.length === 0
                    ? 'Employee payment records will appear here once you begin processing confidential salary payments to registered employees.'
                    : 'No payments match your current filter. Try adjusting the filter criteria.'}
                </p>
                {transactions.length === 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('solana-pay')}
                  >
                    <span className="material-icons">qr_code</span>
                    Make First Payment
                  </button>
                )}
              </div>
            ) : (
              <div className="transactions-list">
                {getFilteredTransactions().map((transaction, index) => (
                  <div key={transaction.id} className="transaction-card" style={{ animationDelay: `${index * 0.1}s` }}>
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
                         <span className="tx-label">Amount:</span>
                         <span className="tx-value">{formatCurrency(transaction.amount || 0)}</span>
                       </div>
                       <div className="transaction-row">
                         <span className="tx-label">Date:</span>
                         <span className="tx-value">{typeof transaction.date === 'string' ? transaction.date : formatDate(transaction.date)}</span>
                       </div>
                      {transaction.signature && (
                        <div className="transaction-row">
                          <span className="tx-label">Transaction ID:</span>
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

      case 'solana-pay':
        return (
          <div className="solana-pay-content">
            <SolanaPayDashboard 
              employees={employees}
              onPaymentCreated={(payment) => {
                console.log('Payment created:', payment);
                // Refresh transactions
                if (userProfile?.uid) {
                  transactionService.getTransactionsByCorporation(userProfile.uid)
                    .then(setTransactions)
                    .catch(console.error);
                }
              }}
              onBulkPayrollCreated={(payroll) => {
                console.log('Bulk payroll created:', payroll);
                // Refresh transactions
                if (userProfile?.uid) {
                  transactionService.getTransactionsByCorporation(userProfile.uid)
                    .then(setTransactions)
                    .catch(console.error);
                }
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Enhanced Header */}
        <header className="dashboard-header">
          <div className="header-top">
            <div>
              <div className="header-badge">
                <span className="badge-text">Corporate Dashboard</span>
              </div>
              <h1 className="dashboard-title">
                Welcome back, {userProfile?.companyName || userProfile?.employeeName || 'Corporation'}
              </h1>
              <p className="dashboard-subtitle">
                Manage your corporate payroll with confidential, secure transactions on Solana
              </p>
            </div>
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              title="Sign Out"
            >
              <span className="material-icons">logout</span>
              Sign Out
            </button>
          </div>
        </header>

        {/* Enhanced Navigation */}
        <nav className="professional-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as TabType)}
              title={tab.description}
            >
              <span className="tab-icon material-icons">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="dashboard-content">
          {renderTabContent()}
        </main>

        {/* Enhanced Add Employee Modal */}
        {isAddEmployeeModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddEmployeeModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Employee</h2>
                <button 
                  className="modal-close"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  disabled={isSubmitting}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
              
              <div className="modal-body">
                {submitError && (
                  <div className="modal-error">
                    <span className="material-icons">error</span>
                    {submitError}
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label">Employee Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. John Smith"
                    value={employeeFormData.name}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="john.smith@company.com"
                    value={employeeFormData.email}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Engineering, Sales, Marketing"
                    value={employeeFormData.department}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, department: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Annual Salary *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="75000"
                    value={employeeFormData.salary || ''}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, salary: Number(e.target.value)})}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Solana Wallet Address (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Leave blank if unknown - can be added later"
                    value={employeeFormData.walletAddress}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, walletAddress: e.target.value})}
                    disabled={isSubmitting}
                  />
                  <p className="form-help">
                    Employee can provide this later. Payments require a valid Solana wallet address.
                  </p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={addEmployee}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <span className="material-icons">add</span>
                      Add Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deposit Modal */}
        {isDepositModalOpen && (
          <div className="modal-overlay" onClick={() => setIsDepositModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Deposit Funds</h2>
                <button className="modal-close" onClick={() => setIsDepositModalOpen(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="info-card">
                  <span className="material-icons">info</span>
                  <p>
                    To deposit funds to your corporate treasury, send SOL or USDC to your connected wallet address.
                    Your wallet is ready to receive funds for payroll operations.
                  </p>
                </div>
                <div className="transaction-row" style={{marginTop: '16px'}}>
                  <span className="tx-label">Your Wallet:</span>
                  <span className="tx-address">{walletInfo?.publicKey}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Network:</span>
                  <span className="tx-value">Solana {networkInfo.isDevnet ? 'Devnet' : 'Mainnet'}</span>
                </div>
                {networkInfo.isDevnet && (
                  <div className="info-card" style={{marginTop: '16px', background: 'rgba(245, 158, 11, 0.1)'}}>
                    <span className="material-icons" style={{color: '#f59e0b'}}>science</span>
                    <p>
                      You're on Devnet. Get free test SOL from the{' '}
                      <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" style={{color: '#4A90E2'}}>
                        Solana Faucet
                      </a>
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsDepositModalOpen(false)}>
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(walletInfo?.publicKey || '');
                    alert('Wallet address copied to clipboard!');
                  }}
                >
                  <span className="material-icons">content_copy</span>
                  Copy Address
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generate Report Modal */}
        {isReportModalOpen && (
          <div className="modal-overlay" onClick={() => setIsReportModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Generate Report</h2>
                <button className="modal-close" onClick={() => setIsReportModalOpen(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <h4>Payroll Summary</h4>
                <div className="transaction-row">
                  <span className="tx-label">Total Employees:</span>
                  <span className="tx-value">{employees.length}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Active Employees:</span>
                  <span className="tx-value">{employees.filter(e => e.status === 'active').length}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Monthly Payroll:</span>
                  <span className="tx-value">{formatCurrency(calculatePayrollMetrics().totalMonthlyPayroll)}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Total Transactions:</span>
                  <span className="tx-value">{transactions.length}</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Report Date:</span>
                  <span className="tx-value">{formatDate(new Date())}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsReportModalOpen(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleExportTransactions}>
                  <span className="material-icons">download</span>
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Modal */}
        {isComplianceModalOpen && (
          <div className="modal-overlay" onClick={() => setIsComplianceModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Compliance Reports</h2>
                <button className="modal-close" onClick={() => setIsComplianceModalOpen(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="info-card">
                  <span className="material-icons">verified</span>
                  <p>All payroll transactions are recorded on the Solana blockchain for complete transparency and auditability.</p>
                </div>
                <h4 style={{marginTop: '16px'}}>Compliance Status</h4>
                <div className="transaction-row">
                  <span className="tx-label">Blockchain Records:</span>
                  <span className="tx-value private">✓ Verified</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Privacy Compliance:</span>
                  <span className="tx-value private">✓ Confidential Transfers</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Audit Trail:</span>
                  <span className="tx-value private">✓ Complete</span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsComplianceModalOpen(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleExportTransactions}>
                  <span className="material-icons">download</span>
                  Export Audit Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings Modal */}
        {isPrivacyModalOpen && (
          <div className="modal-overlay" onClick={() => setIsPrivacyModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Privacy Settings</h2>
                <button className="modal-close" onClick={() => setIsPrivacyModalOpen(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="info-card">
                  <span className="material-icons">security</span>
                  <p>OnionUSD-P uses Solana's Token-2022 confidential transfer extension to hide payment amounts on-chain.</p>
                </div>
                <h4 style={{marginTop: '16px'}}>Privacy Features</h4>
                <div className="transaction-row">
                  <span className="tx-label">Confidential Transfers:</span>
                  <span className="tx-value private">✓ Enabled</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Amount Privacy:</span>
                  <span className="tx-value private">✓ Hidden on-chain</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Recipient Privacy:</span>
                  <span className="tx-value">Public (standard addresses)</span>
                </div>
                <div className="transaction-row">
                  <span className="tx-label">Transaction Verification:</span>
                  <span className="tx-value private">✓ Zero-knowledge proofs</span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setIsPrivacyModalOpen(false)}>
                  Done
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
