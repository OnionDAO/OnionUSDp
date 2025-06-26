import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export type UserType = 'corporation' | 'employee';

export interface UserProfile {
  uid: string;
  email: string;
  userType: UserType;
  companyName?: string;
  employeeName?: string;
  corporationId?: string; // For employees to link to corporation
  walletInfo?: WalletInfo; // Store wallet info in database
}

export interface WalletInfo {
  address: string;
  publicKey: string;
  connected: boolean;
  lastConnected: number;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  walletInfo: WalletInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, additionalData: any) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  connectWallet: () => Promise<WalletInfo | null>;
  disconnectWallet: () => void;
  getStoredWallet: () => WalletInfo | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Wallet persistence functions
  const getStoredWallet = (): WalletInfo | null => {
    try {
      const stored = localStorage.getItem('onion_wallet_info');
      if (stored) {
        const walletData = JSON.parse(stored);
        // Check if wallet connection is recent (within 7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        if (Date.now() - walletData.lastConnected < maxAge) {
          return walletData;
        }
      }
    } catch (error) {
      console.error('Error retrieving stored wallet:', error);
    }
    return null;
  };

  const storeWallet = (wallet: WalletInfo) => {
    try {
      localStorage.setItem('onion_wallet_info', JSON.stringify(wallet));
    } catch (error) {
      console.error('Error storing wallet:', error);
    }
  };

  const clearStoredWallet = () => {
    try {
      localStorage.removeItem('onion_wallet_info');
    } catch (error) {
      console.error('Error clearing stored wallet:', error);
    }
  };

  const connectWallet = async (): Promise<WalletInfo | null> => {
    try {
      if (!(window as any).solana) {
        throw new Error('No Solana wallet detected. Please install Phantom or another Solana wallet.');
      }

      const response = await (window as any).solana.connect();
      if (!response?.publicKey) {
        throw new Error('Failed to connect to wallet');
      }

      const publicKey = response.publicKey.toString();
      const walletData: WalletInfo = {
        address: `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        publicKey: publicKey,
        connected: true,
        lastConnected: Date.now()
      };

      setWalletInfo(walletData);
      storeWallet(walletData);
      
      // Save wallet info to database if user is logged in
      if (currentUser && userProfile) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(userRef, { walletInfo: walletData }, { merge: true });
          console.log('Wallet info saved to database');
          
          // Update local userProfile state
          setUserProfile({
            ...userProfile,
            walletInfo: walletData
          });
        } catch (error) {
          console.error('Error saving wallet to database:', error);
        }
      }
      
      return walletData;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    setWalletInfo(null);
    clearStoredWallet();
    
    // Remove wallet info from database if user is logged in
    if (currentUser && userProfile) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { walletInfo: null }, { merge: true });
        console.log('Wallet info removed from database');
        
        // Update local userProfile state
        setUserProfile({
          ...userProfile,
          walletInfo: undefined
        });
      } catch (error) {
        console.error('Error removing wallet from database:', error);
      }
    }
    
    try {
      if ((window as any).solana) {
        (window as any).solana.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const attemptAutoReconnect = async () => {
    const storedWallet = getStoredWallet();
    if (storedWallet && (window as any).solana) {
      try {
        // Try silent connection first
        const response = await (window as any).solana.connect({ onlyIfTrusted: true });
        if (response?.publicKey) {
          const publicKey = response.publicKey.toString();
          // Verify the stored wallet matches the connected one
          if (publicKey === storedWallet.publicKey) {
            setWalletInfo({
              ...storedWallet,
              lastConnected: Date.now()
            });
            storeWallet({
              ...storedWallet,
              lastConnected: Date.now()
            });
            console.log('Wallet auto-reconnected successfully');
          } else {
            // Different wallet, clear stored data
            clearStoredWallet();
          }
        }
      } catch (error) {
        console.log('Auto-reconnect failed, user will need to connect manually');
        clearStoredWallet();
      }
    }
  };

  const signUp = async (email: string, password: string, userType: UserType, additionalData: any) => {
    try {
      console.log('Creating user account...');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        userType,
        ...(userType === 'corporation' ? { companyName: additionalData.companyName } : {
          employeeName: additionalData.employeeName,
          corporationId: additionalData.corporationId
        })
      };

      console.log('Saving user profile to Firestore...', profile);
      await setDoc(doc(db, 'users', user.uid), profile);
      
      console.log('Setting user profile in state...');
      setUserProfile(profile);
      
      console.log('Sign up completed successfully');
      return profile;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('User signed in, fetching profile...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sign in completed');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
    await disconnectWallet(); // Also disconnect wallet on sign out
  };

  const fetchUserProfile = async (user: User) => {
    try {
      console.log('Fetching user profile for UID:', user.uid);
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        console.log('User profile fetched successfully:', profile);
        setUserProfile(profile);
        
        // Load wallet info from database if available
        if (profile.walletInfo) {
          console.log('Loading wallet info from database:', profile.walletInfo);
          setWalletInfo(profile.walletInfo);
          storeWallet(profile.walletInfo);
        }
      } else {
        console.warn('No user profile document found for UID:', user.uid);
        console.log('Creating default employee profile for user');
        
        const defaultProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          userType: 'employee',
          employeeName: user.email?.split('@')[0] || 'User',
          corporationId: 'default-corp'
        };
        
        console.log('Saving default profile:', defaultProfile);
        await setDoc(docRef, defaultProfile);
        setUserProfile(defaultProfile);
        console.log('Default profile created successfully');
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
        // Attempt wallet auto-reconnect after user authentication
        await attemptAutoReconnect();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      console.log('Auth loading complete');
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    walletInfo,
    loading,
    signIn,
    signUp,
    signOut,
    connectWallet,
    disconnectWallet,
    getStoredWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 