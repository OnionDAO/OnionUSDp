// User and Authentication Types
export type UserType = 'corporation' | 'employee';

// Wallet Types
export interface WalletInfo {
  address: string;
  publicKey: string;
  connected: boolean;
  lastConnected: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  userType: UserType;
  companyName?: string;
  employeeName?: string;
  corporationId?: string;
  walletAddress?: string;
  walletInfo?: WalletInfo; // Store wallet info in database
  department?: string;
  salary?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  corporationId: string;
  department: string;
  salary: number;
  lastPayment?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'payroll' | 'payment' | 'compliance' | 'salary' | 'bonus' | 'reimbursement';
  amount: number;
  recipient: string;
  recipientId?: string;
  sender?: string;
  senderId?: string;
  corporationId: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  private: boolean;
  signature?: string;
  metadata?: {
    batchId?: string;
    employeeCount?: number;
    note?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Payment Request Types
export interface PaymentRequest {
  id: string;
  employeeId: string;
  corporationId: string;
  amount: number;
  reason: string;
  requestType: 'expense' | 'advance' | 'bonus' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  documents?: string[]; // URLs to uploaded documents
  submittedAt: Date;
  reviewedAt?: Date;
  paidAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

// Company/Corporation Types
export interface Corporation {
  id: string;
  name: string;
  email: string;
  ownerId: string; // Firebase UID of the owner
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large';
  walletAddress?: string;
  settings: {
    defaultPrivacy: boolean;
    autoPayroll: boolean;
    payrollFrequency: 'weekly' | 'biweekly' | 'monthly';
  };
  stats: {
    totalBalance: number;
    activeEmployees: number;
    totalTransactions: number;
    monthlyPayroll: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalBalance: number;
  activeEmployees: number;
  privateTransactions: number;
  complianceScore: number;
  monthlyChange: {
    balance: number;
    employees: number;
    transactions: number;
  };
}

export interface EmployeeDashboardStats {
  totalBalance: number;
  publicBalance: number;
  privateBalance: number;
  monthlyIncome: number;
  pendingAmount: number;
} 