import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  lastPayment: string;
  status: 'active' | 'pending' | 'inactive';
}

interface Transaction {
  id: string;
  type: 'payroll' | 'payment' | 'compliance';
  amount: number;
  recipient: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  private: boolean;
}

const CorporationDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  // Mock data - in real app, this would come from Firestore
  useEffect(() => {
    setEmployees([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@company.com',
        walletAddress: '0x742d...8f9c',
        lastPayment: '2025-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@company.com',
        walletAddress: '0x8b3e...2a1d',
        lastPayment: '2025-01-15',
        status: 'active'
      },
      {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@company.com',
        walletAddress: '0x9c4f...7e8b',
        lastPayment: '2025-01-10',
        status: 'pending'
      }
    ]);

    setTransactions([
      {
        id: '1',
        type: 'payroll',
        amount: 125000,
        recipient: 'Batch Payment (15 employees)',
        date: '2025-01-15',
        status: 'completed',
        private: true
      },
      {
        id: '2',
        type: 'payment',
        amount: 5000,
        recipient: 'john@company.com',
        date: '2025-01-14',
        status: 'completed',
        private: true
      },
      {
        id: '3',
        type: 'compliance',
        amount: 0,
        recipient: 'Regulatory Report',
        date: '2025-01-13',
        status: 'completed',
        private: false
      }
    ]);
  }, []);

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>$2,847,392</h3>
            <p>Total Balance</p>
            <span className="stat-change positive">+12.3% from last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>247</h3>
            <p>Active Employees</p>
            <span className="stat-change positive">+8 new this month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <h3>1,284</h3>
            <p>Private Transactions</p>
            <span className="stat-change neutral">This month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>98.7%</h3>
            <p>Compliance Score</p>
            <span className="stat-change positive">+0.2% improvement</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card large">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="activity-list">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="activity-item">
                <div className="activity-icon">
                  {tx.type === 'payroll' ? '💸' : tx.type === 'payment' ? '💳' : '📋'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{tx.recipient}</div>
                  <div className="activity-meta">
                    {tx.amount > 0 && `$${tx.amount.toLocaleString()}`} • {tx.date}
                    {tx.private && <span className="private-badge">🔒 Private</span>}
                  </div>
                </div>
                <div className={`status-badge ${tx.status}`}>{tx.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => setShowPayrollModal(true)}>
              <div className="action-icon">💸</div>
              <div className="action-text">
                <strong>Process Payroll</strong>
                <span>Bulk payment to employees</span>
              </div>
            </button>
            
            <button className="action-btn" onClick={() => setShowAddEmployee(true)}>
              <div className="action-icon">👤</div>
              <div className="action-text">
                <strong>Add Employee</strong>
                <span>Invite new team member</span>
              </div>
            </button>
            
            <button className="action-btn">
              <div className="action-icon">📊</div>
              <div className="action-text">
                <strong>Generate Report</strong>
                <span>Compliance & analytics</span>
              </div>
            </button>
            
            <button className="action-btn">
              <div className="action-icon">⚙️</div>
              <div className="action-text">
                <strong>Settings</strong>
                <span>Configure account</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="employees-section">
      <div className="section-header">
        <h3>Employee Management</h3>
        <button className="btn-primary" onClick={() => setShowAddEmployee(true)}>
          + Add Employee
        </button>
      </div>
      
      <div className="employees-table">
        <div className="table-header">
          <div>Employee</div>
          <div>Wallet Address</div>
          <div>Last Payment</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {employees.map(employee => (
          <div key={employee.id} className="table-row">
            <div className="employee-info">
              <div className="employee-avatar">{employee.name.charAt(0)}</div>
              <div>
                <div className="employee-name">{employee.name}</div>
                <div className="employee-email">{employee.email}</div>
              </div>
            </div>
            <div className="wallet-address">{employee.walletAddress}</div>
            <div>{employee.lastPayment}</div>
            <div>
              <span className={`status-badge ${employee.status}`}>
                {employee.status}
              </span>
            </div>
            <div className="actions">
              <button className="btn-icon">💸</button>
              <button className="btn-icon">✏️</button>
              <button className="btn-icon">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="transactions-section">
      <div className="section-header">
        <h3>Transaction History</h3>
        <div className="filters">
          <select className="filter-select">
            <option>All Types</option>
            <option>Payroll</option>
            <option>Individual Payments</option>
            <option>Compliance</option>
          </select>
          <select className="filter-select">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>
      
      <div className="transactions-table">
        <div className="table-header">
          <div>Type</div>
          <div>Recipient</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Privacy</div>
          <div>Status</div>
        </div>
        
        {transactions.map(tx => (
          <div key={tx.id} className="table-row">
            <div className="transaction-type">
              <span className={`type-badge ${tx.type}`}>
                {tx.type === 'payroll' ? '💸' : tx.type === 'payment' ? '💳' : '📋'}
                {tx.type}
              </span>
            </div>
            <div>{tx.recipient}</div>
            <div className="amount">
              {tx.amount > 0 ? `$${tx.amount.toLocaleString()}` : '-'}
            </div>
            <div>{tx.date}</div>
            <div>
              <span className={`privacy-badge ${tx.private ? 'private' : 'public'}`}>
                {tx.private ? '🔒 Private' : '👁️ Public'}
              </span>
            </div>
            <div>
              <span className={`status-badge ${tx.status}`}>{tx.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>{userProfile?.companyName}</h1>
          <p>Corporate Dashboard</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">🏢</div>
            <div className="user-details">
              <span className="user-name">{userProfile?.companyName}</span>
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
          className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          👥 Employees
        </button>
        <button 
          className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          💳 Transactions
        </button>
        <button 
          className={`nav-btn ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          📋 Compliance
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
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'compliance' && (
          <div className="compliance-section">
            <h3>Compliance Dashboard</h3>
            <p>Regulatory reporting and compliance tools coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <p>Account configuration and preferences coming soon...</p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="modal-overlay" onClick={() => setShowAddEmployee(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button className="modal-close" onClick={() => setShowAddEmployee(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter employee name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter email address" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select>
                  <option>Select department</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>HR</option>
                </select>
              </div>
              <div className="form-group">
                <label>Salary (USD)</label>
                <input type="number" placeholder="Annual salary" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddEmployee(false)}>Cancel</button>
              <button className="btn-primary">Add Employee</button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Modal */}
      {showPayrollModal && (
        <div className="modal-overlay" onClick={() => setShowPayrollModal(false)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Process Payroll</h3>
              <button className="modal-close" onClick={() => setShowPayrollModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="payroll-summary">
                <div className="summary-item">
                  <span>Employees to pay:</span>
                  <strong>247</strong>
                </div>
                <div className="summary-item">
                  <span>Total amount:</span>
                  <strong>$2,847,392</strong>
                </div>
                <div className="summary-item">
                  <span>Privacy mode:</span>
                  <strong>🔒 Private</strong>
                </div>
              </div>
              <div className="form-group">
                <label>Payment Date</label>
                <input type="date" defaultValue="2025-01-20" />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Use private transactions
                </label>
                <small>Amounts will be hidden from public view</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPayrollModal(false)}>Cancel</button>
              <button className="btn-primary">Process Payroll</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporationDashboard; 