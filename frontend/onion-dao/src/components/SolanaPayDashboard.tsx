import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { solanaPayService, type PaymentRequest, type BulkPayrollRequest } from '../services/solanaPayService';
import type { Employee } from '../types';
import SolanaPayQR from './SolanaPayQR';
import './SolanaPayDashboard.css';

interface SolanaPayDashboardProps {
  employees: Employee[];
  onPaymentCreated?: (payment: PaymentRequest) => void;
  onBulkPayrollCreated?: (payroll: BulkPayrollRequest) => void;
}

type PaymentType = 'employee' | 'bulk-payroll' | 'vendor' | 'invoice';
type TokenType = 'SOL' | 'USDC' | 'OnionUSD-P';

const SolanaPayDashboard: React.FC<SolanaPayDashboardProps> = ({
  employees,
  onPaymentCreated,
  onBulkPayrollCreated
}) => {
  const { walletInfo } = useAuth();
  const [activePaymentType, setActivePaymentType] = useState<PaymentType>('employee');
  const [currentPayment, setCurrentPayment] = useState<PaymentRequest | null>(null);
  const [currentBulkPayroll, setCurrentBulkPayroll] = useState<BulkPayrollRequest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Employee Payment Form
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    amount: 0,
    token: 'USDC' as TokenType,
    memo: ''
  });

  // Bulk Payroll Form
  const [bulkPayrollForm, setBulkPayrollForm] = useState({
    token: 'USDC' as TokenType,
    selectedEmployees: new Set<string>(),
    salaryOverrides: {} as Record<string, number>
  });

  // Vendor Payment Form
  const [vendorForm, setVendorForm] = useState({
    walletAddress: '',
    amount: 0,
    token: 'USDC' as TokenType,
    description: ''
  });

  // Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    amount: 0,
    token: 'USDC' as TokenType,
    description: '',
    clientWallet: ''
  });

  // Wallet balances
  const [balances, setBalances] = useState<Record<TokenType, number>>({
    SOL: 0,
    USDC: 0,
    'OnionUSD-P': 0
  });

  // Initialize Solana Pay service when wallet connects
  useEffect(() => {
    if (walletInfo?.publicKey) {
      solanaPayService.setCorporateWallet(walletInfo.publicKey);
      loadBalances();
    }
  }, [walletInfo]);

  // Load wallet balances
  const loadBalances = async () => {
    if (!walletInfo?.publicKey) return;

    try {
      const [solBalance, usdcBalance, onionBalance] = await Promise.all([
        solanaPayService.getWalletBalance(walletInfo.publicKey, 'SOL'),
        solanaPayService.getWalletBalance(walletInfo.publicKey, 'USDC'),
        solanaPayService.getWalletBalance(walletInfo.publicKey, 'OnionUSD-P')
      ]);

      setBalances({
        SOL: solBalance,
        USDC: usdcBalance,
        'OnionUSD-P': onionBalance
      });
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  // Generate employee payment
  const generateEmployeePayment = async () => {
    if (!employeeForm.employeeId || !employeeForm.amount) {
      setError('Please select an employee and enter an amount');
      return;
    }

    const employee = employees.find(emp => emp.id === employeeForm.employeeId);
    if (!employee) {
      setError('Employee not found');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const payment = await solanaPayService.generateEmployeePayment(
        employee,
        employeeForm.amount,
        employeeForm.token,
        employeeForm.memo || `Payment to ${employee.name}`
      );

      setCurrentPayment(payment);
      onPaymentCreated?.(payment);
      
      // Reset form
      setEmployeeForm({
        employeeId: '',
        amount: 0,
        token: 'USDC',
        memo: ''
      });
    } catch (error) {
      console.error('Error generating payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate payment');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate bulk payroll
  const generateBulkPayroll = async () => {
    if (bulkPayrollForm.selectedEmployees.size === 0) {
      setError('Please select at least one employee');
      return;
    }

    const selectedEmployees = employees.filter(emp => 
      bulkPayrollForm.selectedEmployees.has(emp.id)
    );

    setIsGenerating(true);
    setError(null);

    try {
      const bulkPayroll = await solanaPayService.generateBulkPayroll(
        selectedEmployees,
        bulkPayrollForm.salaryOverrides,
        bulkPayrollForm.token
      );

      setCurrentBulkPayroll(bulkPayroll);
      onBulkPayrollCreated?.(bulkPayroll);
      
      // Reset form
      setBulkPayrollForm({
        token: 'USDC',
        selectedEmployees: new Set(),
        salaryOverrides: {}
      });
    } catch (error) {
      console.error('Error generating bulk payroll:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate bulk payroll');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate vendor payment
  const generateVendorPayment = async () => {
    if (!vendorForm.walletAddress || !vendorForm.amount || !vendorForm.description) {
      setError('Please fill in all vendor payment fields');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const payment = await solanaPayService.generateVendorPayment(
        vendorForm.walletAddress,
        vendorForm.amount,
        vendorForm.description,
        vendorForm.token
      );

      setCurrentPayment(payment);
      onPaymentCreated?.(payment);
      
      // Reset form
      setVendorForm({
        walletAddress: '',
        amount: 0,
        token: 'USDC',
        description: ''
      });
    } catch (error) {
      console.error('Error generating vendor payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate vendor payment');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate invoice
  const generateInvoice = async () => {
    if (!invoiceForm.amount || !invoiceForm.description) {
      setError('Please fill in amount and description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const payment = await solanaPayService.generateInvoicePayment(
        invoiceForm.amount,
        invoiceForm.description,
        invoiceForm.token
      );

      setCurrentPayment(payment);
      onPaymentCreated?.(payment);
      
      // Reset form
      setInvoiceForm({
        amount: 0,
        token: 'USDC',
        description: '',
        clientWallet: ''
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle employee selection for bulk payroll
  const toggleEmployeeSelection = (employeeId: string) => {
    const newSelection = new Set(bulkPayrollForm.selectedEmployees);
    if (newSelection.has(employeeId)) {
      newSelection.delete(employeeId);
    } else {
      newSelection.add(employeeId);
    }
    setBulkPayrollForm({ ...bulkPayrollForm, selectedEmployees: newSelection });
  };

  // Update salary override
  const updateSalaryOverride = (employeeId: string, amount: number) => {
    setBulkPayrollForm({
      ...bulkPayrollForm,
      salaryOverrides: {
        ...bulkPayrollForm.salaryOverrides,
        [employeeId]: amount
      }
    });
  };

  const paymentTypes = [
    { id: 'employee', label: 'Employee Payment', icon: 'person', description: 'Pay individual employees' },
    { id: 'bulk-payroll', label: 'Bulk Payroll', icon: 'groups', description: 'Process monthly payroll' },
    { id: 'vendor', label: 'Vendor Payment', icon: 'business', description: 'Pay contractors and vendors' },
    { id: 'invoice', label: 'Generate Invoice', icon: 'receipt', description: 'Request payment from clients' }
  ];

  const tokenOptions: { value: TokenType; label: string; balance: number }[] = [
    { value: 'SOL', label: 'SOL', balance: balances.SOL },
    { value: 'USDC', label: 'USDC', balance: balances.USDC },
    { value: 'OnionUSD-P', label: 'OnionUSD-P', balance: balances['OnionUSD-P'] }
  ];

  return (
    <div className="solana-pay-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span className="material-icons">payment</span>
          Solana Pay Integration
        </h2>
        <p className="dashboard-subtitle">
          Generate QR codes for instant payments using Solana Pay protocol
        </p>
      </div>

      {/* Wallet Balances */}
      <div className="balance-overview">
        <h3>Treasury Balances</h3>
        <div className="balance-grid">
          {tokenOptions.map(token => (
            <div key={token.value} className="balance-card">
              <div className="balance-label">{token.label}</div>
              <div className="balance-amount">
                {token.value === 'SOL' 
                  ? `${token.balance.toFixed(4)} SOL`
                  : `$${token.balance.toLocaleString()}`
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        {/* Payment Type Selection */}
        <div className="payment-type-selection">
          <h3>Payment Type</h3>
          <div className="payment-types">
            {paymentTypes.map(type => (
              <button
                key={type.id}
                className={`payment-type-card ${activePaymentType === type.id ? 'active' : ''}`}
                onClick={() => setActivePaymentType(type.id as PaymentType)}
              >
                <span className="material-icons type-icon">{type.icon}</span>
                <div className="type-content">
                  <h4>{type.label}</h4>
                  <p>{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Forms */}
        <div className="payment-form-section">
          {/* Employee Payment Form */}
          {activePaymentType === 'employee' && (
            <div className="payment-form">
              <h3>Employee Payment</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee</label>
                  <select
                    value={employeeForm.employeeId}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, employeeId: e.target.value })}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={employeeForm.amount}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, amount: Number(e.target.value) })}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Token</label>
                  <select
                    value={employeeForm.token}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, token: e.target.value as TokenType })}
                  >
                    {tokenOptions.map(token => (
                      <option key={token.value} value={token.value}>
                        {token.label} (Balance: {token.value === 'SOL' ? token.balance.toFixed(4) : token.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Memo (Optional)</label>
                  <input
                    type="text"
                    value={employeeForm.memo}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, memo: e.target.value })}
                    placeholder="Payment description"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={generateEmployeePayment}
                disabled={isGenerating || !employeeForm.employeeId || !employeeForm.amount}
              >
                <span className="material-icons">qr_code</span>
                {isGenerating ? 'Generating...' : 'Generate Payment QR'}
              </button>
            </div>
          )}

          {/* Bulk Payroll Form */}
          {activePaymentType === 'bulk-payroll' && (
            <div className="payment-form">
              <h3>Bulk Payroll Processing</h3>
              
              <div className="form-group">
                <label>Payment Token</label>
                <select
                  value={bulkPayrollForm.token}
                  onChange={(e) => setBulkPayrollForm({ ...bulkPayrollForm, token: e.target.value as TokenType })}
                >
                  {tokenOptions.map(token => (
                    <option key={token.value} value={token.value}>
                      {token.label} (Balance: {token.value === 'SOL' ? token.balance.toFixed(4) : token.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="employee-selection">
                <h4>Select Employees ({bulkPayrollForm.selectedEmployees.size} selected)</h4>
                <div className="employee-list">
                  {employees.map(employee => (
                    <div key={employee.id} className="employee-item">
                      <div className="employee-checkbox">
                        <input
                          type="checkbox"
                          checked={bulkPayrollForm.selectedEmployees.has(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                        />
                        <div className="employee-info">
                          <span className="employee-name">{employee.name}</span>
                          <span className="employee-dept">{employee.department}</span>
                        </div>
                      </div>
                      <div className="salary-override">
                        <input
                          type="number"
                          value={bulkPayrollForm.salaryOverrides[employee.id] || employee.salary}
                          onChange={(e) => updateSalaryOverride(employee.id, Number(e.target.value))}
                          placeholder="Salary amount"
                          min="0"
                          step="0.01"
                          disabled={!bulkPayrollForm.selectedEmployees.has(employee.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={generateBulkPayroll}
                disabled={isGenerating || bulkPayrollForm.selectedEmployees.size === 0}
              >
                <span className="material-icons">qr_code_2</span>
                {isGenerating ? 'Generating...' : `Generate Payroll QRs (${bulkPayrollForm.selectedEmployees.size} employees)`}
              </button>
            </div>
          )}

          {/* Vendor Payment Form */}
          {activePaymentType === 'vendor' && (
            <div className="payment-form">
              <h3>Vendor Payment</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Vendor Wallet Address</label>
                  <input
                    type="text"
                    value={vendorForm.walletAddress}
                    onChange={(e) => setVendorForm({ ...vendorForm, walletAddress: e.target.value })}
                    placeholder="Solana wallet address"
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={vendorForm.amount}
                    onChange={(e) => setVendorForm({ ...vendorForm, amount: Number(e.target.value) })}
                    placeholder="Payment amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Token</label>
                  <select
                    value={vendorForm.token}
                    onChange={(e) => setVendorForm({ ...vendorForm, token: e.target.value as TokenType })}
                  >
                    {tokenOptions.map(token => (
                      <option key={token.value} value={token.value}>
                        {token.label} (Balance: {token.value === 'SOL' ? token.balance.toFixed(4) : token.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <input
                    type="text"
                    value={vendorForm.description}
                    onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })}
                    placeholder="Payment description"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={generateVendorPayment}
                disabled={isGenerating || !vendorForm.walletAddress || !vendorForm.amount}
              >
                <span className="material-icons">qr_code</span>
                {isGenerating ? 'Generating...' : 'Generate Vendor Payment QR'}
              </button>
            </div>
          )}

          {/* Invoice Form */}
          {activePaymentType === 'invoice' && (
            <div className="payment-form">
              <h3>Generate Invoice</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Invoice Amount</label>
                  <input
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    placeholder="Invoice amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Token</label>
                  <select
                    value={invoiceForm.token}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, token: e.target.value as TokenType })}
                  >
                    {tokenOptions.map(token => (
                      <option key={token.value} value={token.value}>
                        {token.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <input
                    type="text"
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                    placeholder="Invoice description"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Client Wallet (Optional)</label>
                  <input
                    type="text"
                    value={invoiceForm.clientWallet}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, clientWallet: e.target.value })}
                    placeholder="Client's Solana wallet address (optional)"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={generateInvoice}
                disabled={isGenerating || !invoiceForm.amount || !invoiceForm.description}
              >
                <span className="material-icons">receipt</span>
                {isGenerating ? 'Generating...' : 'Generate Invoice QR'}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <span className="material-icons">error</span>
              {error}
            </div>
          )}
        </div>

        {/* QR Code Display */}
        {(currentPayment || currentBulkPayroll) && (
          <div className="qr-code-section">
            <h3>Payment QR Code</h3>
            {currentPayment && (
              <SolanaPayQR
                paymentRequest={currentPayment}
              />
            )}
            
            {currentBulkPayroll && (
              <div className="bulk-payroll-qrs">
                <p>Generated {currentBulkPayroll.qrCodes.length} payment QR codes for bulk payroll</p>
                <div className="qr-grid">
                  {currentBulkPayroll.employees.map((item) => (
                    <div key={item.employee.id} className="bulk-qr-item">
                      <h4>{item.employee.name}</h4>
                      <p>${item.amount.toLocaleString()}</p>
                      {/* You would render individual QR codes here */}
                      <div className="qr-placeholder">
                        QR Code for {item.employee.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolanaPayDashboard; 