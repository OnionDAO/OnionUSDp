import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot,
  type WriteBatch,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { 
  Employee, 
  Transaction, 
  PaymentRequest, 
  Corporation, 
  DashboardStats, 
  EmployeeDashboardStats 
} from '../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  EMPLOYEES: 'employees',
  TRANSACTIONS: 'transactions',
  PAYMENT_REQUESTS: 'paymentRequests',
  CORPORATIONS: 'corporations'
} as const;

// Helper function to convert Firestore timestamps to dates
const convertTimestamps = (data: DocumentData) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// Employee Services
export const employeeService = {
  // Create a new employee
  async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const employee = {
      ...employeeData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.EMPLOYEES), employee);
    return docRef.id;
  },

  // Get employees by corporation ID
  async getEmployeesByCorporation(corporationId: string): Promise<Employee[]> {
    const q = query(
      collection(db, COLLECTIONS.EMPLOYEES),
      where('corporationId', '==', corporationId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as Employee));
  },

  // Get single employee by ID
  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, employeeId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...convertTimestamps(snapshot.data())
    } as Employee;
  },

  // Update employee
  async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, employeeId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Delete employee
  async deleteEmployee(employeeId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, employeeId);
    await deleteDoc(docRef);
  },

  // Listen to employee changes
  onEmployeesChange(corporationId: string, callback: (employees: Employee[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.EMPLOYEES),
      where('corporationId', '==', corporationId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const employees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as Employee));
      callback(employees);
    });
  }
};

// Transaction Services
export const transactionService = {
  // Create a new transaction
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const transaction = {
      ...transactionData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), transaction);
    return docRef.id;
  },

  // Get transactions by corporation ID
  async getTransactionsByCorporation(corporationId: string, limitCount?: number): Promise<Transaction[]> {
    let q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('corporationId', '==', corporationId),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as Transaction));
  },

  // Get transactions for an employee
  async getTransactionsForEmployee(employeeId: string, limitCount?: number): Promise<Transaction[]> {
    let q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('recipientId', '==', employeeId),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as Transaction));
  },

  // Create batch payroll transactions
  async createBatchPayroll(
    corporationId: string, 
    employees: Employee[], 
    isPrivate: boolean
  ): Promise<string[]> {
    const batch = writeBatch(db);
    const now = new Date();
    const batchId = `payroll_${Date.now()}`;
    const transactionIds: string[] = [];
    
    employees.forEach(employee => {
      const transactionRef = doc(collection(db, COLLECTIONS.TRANSACTIONS));
      transactionIds.push(transactionRef.id);
      
      const transaction: Omit<Transaction, 'id'> = {
        type: 'salary',
        amount: employee.salary,
        recipient: employee.name,
        recipientId: employee.id,
        corporationId,
        date: now.toISOString().split('T')[0],
        status: 'pending',
        private: isPrivate,
        metadata: {
          batchId,
          employeeCount: employees.length
        },
        createdAt: now,
        updatedAt: now
      };
      
      batch.set(transactionRef, transaction);
    });
    
    await batch.commit();
    return transactionIds;
  },

  // Listen to transaction changes
  onTransactionsChange(corporationId: string, callback: (transactions: Transaction[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('corporationId', '==', corporationId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      } as Transaction));
      callback(transactions);
    });
  }
};

// Payment Request Services
export const paymentRequestService = {
  // Create payment request
  async createPaymentRequest(requestData: Omit<PaymentRequest, 'id' | 'submittedAt'>): Promise<string> {
    const request = {
      ...requestData,
      submittedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENT_REQUESTS), request);
    return docRef.id;
  },

  // Get payment requests by employee
  async getPaymentRequestsByEmployee(employeeId: string): Promise<PaymentRequest[]> {
    const q = query(
      collection(db, COLLECTIONS.PAYMENT_REQUESTS),
      where('employeeId', '==', employeeId),
      orderBy('submittedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as PaymentRequest));
  },

  // Get payment requests by corporation
  async getPaymentRequestsByCorporation(corporationId: string): Promise<PaymentRequest[]> {
    const q = query(
      collection(db, COLLECTIONS.PAYMENT_REQUESTS),
      where('corporationId', '==', corporationId),
      orderBy('submittedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as PaymentRequest));
  },

  // Update payment request status
  async updatePaymentRequestStatus(
    requestId: string, 
    status: PaymentRequest['status'], 
    reviewedBy?: string,
    notes?: string
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PAYMENT_REQUESTS, requestId);
    const updateData: any = {
      status,
      reviewedAt: new Date()
    };
    
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (notes) updateData.notes = notes;
    if (status === 'paid') updateData.paidAt = new Date();
    
    await updateDoc(docRef, updateData);
  }
};

// Corporation Services
export const corporationService = {
  // Create corporation
  async createCorporation(corporationData: Omit<Corporation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const corporation = {
      ...corporationData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CORPORATIONS), corporation);
    return docRef.id;
  },

  // Get corporation by owner ID
  async getCorporationByOwner(ownerId: string): Promise<Corporation | null> {
    const q = query(
      collection(db, COLLECTIONS.CORPORATIONS),
      where('ownerId', '==', ownerId),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as Corporation;
  },

  // Update corporation
  async updateCorporation(corporationId: string, updates: Partial<Corporation>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CORPORATIONS, corporationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Update corporation stats
  async updateCorporationStats(corporationId: string, stats: Corporation['stats']): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CORPORATIONS, corporationId);
    await updateDoc(docRef, {
      stats,
      updatedAt: new Date()
    });
  }
};

// Wallet Services
export const walletService = {
  // Update user wallet info
  async updateUserWallet(userId: string, walletInfo: any): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      walletInfo,
      updatedAt: new Date()
    });
  },

  // Remove user wallet info
  async removeUserWallet(userId: string): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      walletInfo: null,
      updatedAt: new Date()
    });
  },

  // Get user wallet info
  async getUserWallet(userId: string): Promise<any | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    const userData = userSnap.data();
    return userData.walletInfo || null;
  }
};

// Dashboard Stats Services
export const dashboardService = {
  // Calculate corporation dashboard stats
  async getCorporationDashboardStats(corporationId: string): Promise<DashboardStats> {
    const [employees, transactions, corporation] = await Promise.all([
      employeeService.getEmployeesByCorporation(corporationId),
      transactionService.getTransactionsByCorporation(corporationId),
      corporationService.getCorporationByOwner(corporationId)
    ]);

    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const privateTransactions = transactions.filter(tx => tx.private).length;
    
    // Calculate monthly changes based on actual data
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const lastMonthEmployees = employees.filter(emp => 
      new Date(emp.createdAt) <= lastMonth
    ).length;
    const lastMonthTransactions = transactions.filter(tx => 
      new Date(tx.createdAt) <= lastMonth
    ).length;
    
    const monthlyChange = {
      balance: 0, // Would need balance history to calculate
      employees: activeEmployees - lastMonthEmployees,
      transactions: transactions.length - lastMonthTransactions
    };

    // Calculate compliance score based on transaction completion rate
    const completedTransactions = transactions.filter(tx => tx.status === 'completed').length;
    const complianceScore = transactions.length > 0 
      ? Math.round((completedTransactions / transactions.length) * 100)
      : 100;

    return {
      totalBalance: corporation?.stats.totalBalance || 0,
      activeEmployees,
      privateTransactions,
      complianceScore,
      monthlyChange
    };
  },

  // Calculate employee dashboard stats
  async getEmployeeDashboardStats(employeeId: string): Promise<EmployeeDashboardStats> {
    const transactions = await transactionService.getTransactionsForEmployee(employeeId);
    
    const completedTransactions = transactions.filter(tx => tx.status === 'completed');
    const pendingTransactions = transactions.filter(tx => tx.status === 'pending' || tx.status === 'processing');
    
    const totalBalance = completedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const publicBalance = completedTransactions.filter(tx => !tx.private).reduce((sum, tx) => sum + tx.amount, 0);
    const privateBalance = completedTransactions.filter(tx => tx.private).reduce((sum, tx) => sum + tx.amount, 0);
    const pendingAmount = pendingTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate this month's income
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyIncome = completedTransactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalBalance,
      publicBalance,
      privateBalance,
      monthlyIncome,
      pendingAmount
    };
  }
}; 