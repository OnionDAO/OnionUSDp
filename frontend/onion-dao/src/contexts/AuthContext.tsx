import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
  isWalletConnected: boolean; // Helper for easy wallet status checking
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, additionalData: any) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  connectWallet: () => Promise<WalletInfo | null>;
  disconnectWallet: () => Promise<void>; // Completely forgets wallet
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

  // Wallet persistence functions - now using Firebase only
  const getStoredWallet = (): WalletInfo | null => {
    // Wallet info is now loaded from Firebase user profile only
    return userProfile?.walletInfo || null;
  };

  const storeWallet = async (wallet: WalletInfo) => {
    // Store wallet info in Firebase user profile
    if (currentUser && userProfile) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { walletInfo: wallet }, { merge: true });
        console.log('Wallet info saved to Firebase');
        
        // Update local userProfile state
        setUserProfile({
          ...userProfile,
          walletInfo: wallet
        });
      } catch (error) {
        console.error('Error saving wallet to Firebase:', error);
      }
    }
  };

  const clearStoredWallet = async () => {
    // Remove wallet info from Firebase
    if (currentUser && userProfile) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { walletInfo: null }, { merge: true });
        console.log('Wallet info removed from Firebase');
        
        // Update local userProfile state
        setUserProfile({
          ...userProfile,
          walletInfo: undefined
        });
      } catch (error) {
        console.error('Error removing wallet from Firebase:', error);
      }
    }
  };

  const connectWallet = async (): Promise<WalletInfo | null> => {
    try {
      console.log('Attempting to connect wallet...');
      
      if (!(window as any).solana) {
        throw new Error('No Solana wallet detected. Please install Phantom or another Solana wallet.');
      }

      // Check if already connected
      if ((window as any).solana.isConnected && walletInfo?.connected) {
        console.log('Wallet already connected, refreshing info...');
        const publicKey = (window as any).solana.publicKey.toString();
        const updatedWallet: WalletInfo = {
          address: `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
          publicKey: publicKey,
          connected: true,
          lastConnected: Date.now()
        };
        setWalletInfo(updatedWallet);
        await storeWallet(updatedWallet);
        return updatedWallet;
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

      console.log('Wallet connected successfully:', walletData.address);
      setWalletInfo(walletData);
      await storeWallet(walletData);
      
      return walletData;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    console.log('Permanently disconnecting wallet and clearing from Firebase...');
    setWalletInfo(null);
    await clearStoredWallet(); // This removes from Firebase
    
    try {
      if ((window as any).solana && (window as any).solana.isConnected) {
        await (window as any).solana.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const attemptAutoReconnect = async (profileWalletInfo?: WalletInfo) => {
    const storedWallet = profileWalletInfo || getStoredWallet();
    if (storedWallet && (window as any).solana) {
      try {
        // Check if wallet is recent (within 30 days)
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        if (Date.now() - storedWallet.lastConnected > maxAge) {
          console.log('Stored wallet is too old, requiring fresh connection');
          return;
        }

        // Try silent connection first
        const response = await (window as any).solana.connect({ onlyIfTrusted: true });
        if (response?.publicKey) {
          const publicKey = response.publicKey.toString();
          // Verify the stored wallet matches the connected one
          if (publicKey === storedWallet.publicKey) {
            const updatedWallet = {
              ...storedWallet,
              connected: true,
              lastConnected: Date.now()
            };
            setWalletInfo(updatedWallet);
            await storeWallet(updatedWallet);
            console.log('Wallet auto-reconnected successfully');
          } else {
            console.log('Different wallet detected, clearing stored data');
            await clearStoredWallet();
          }
        } else {
          // No wallet response - wallet is NOT connected, but we have stored address
          console.log('No wallet response - wallet needs manual reconnection');
          // Set wallet info but mark as NOT connected so UI shows reconnect prompt
          setWalletInfo({
            ...storedWallet,
            connected: false, // Important: wallet is NOT actually connected
            lastConnected: storedWallet.lastConnected // Keep original timestamp
          });
        }
      } catch (error) {
        console.log('Auto-reconnect failed - wallet needs manual reconnection');
        // Silent connection failed - wallet is NOT connected
        // Restore wallet info but mark as disconnected so user knows to reconnect
        setWalletInfo({
          ...storedWallet,
          connected: false, // Important: wallet is NOT actually connected
          lastConnected: storedWallet.lastConnected
        });
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
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log('User signed in, fetching profile...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sign in completed');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Signing out - preserving wallet info for next login...');
    await firebaseSignOut(auth);
    setUserProfile(null);
    // Only clear local wallet state, keep Firebase wallet info for next login
    setWalletInfo(null);
    
    // Disconnect from wallet extension but don't clear Firebase data
    try {
      if ((window as any).solana && (window as any).solana.isConnected) {
        await (window as any).solana.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet on sign out:', error);
    }
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
        
        // Load wallet info from database if available and attempt auto-reconnection
        if (profile.walletInfo) {
          console.log('✅ Wallet found in Firebase - auto-connecting...', profile.walletInfo.address);
          setWalletInfo(profile.walletInfo);
          // Attempt auto-reconnection with the loaded wallet info
          await attemptAutoReconnect(profile.walletInfo);
          console.log('🎉 Wallet auto-connection complete! No need to connect again.');
        } else {
          console.log('📝 No saved wallet found - user will need to connect wallet');
        }
      } else {
        console.warn('No user profile document found for UID:', user.uid);
        console.log('User needs to complete registration - no profile exists');

        // Don't create a profile automatically - user should register properly
        // This handles edge cases where Firebase Auth exists but profile doesn't
        // The user will need to sign up again with proper details
        setUserProfile(null);

        // Sign them out so they can register properly
        console.log('Signing out user without profile - please register');
        await firebaseSignOut(auth);
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
        // Auto-reconnection is now handled within fetchUserProfile
      } else {
        setUserProfile(null);
        setWalletInfo(null); // Clear local wallet state only
      }
      setLoading(false);
      console.log('Auth loading complete');
    });

    return unsubscribe;
  }, []);

  // Add wallet event listeners for automatic handling of wallet state changes
  useEffect(() => {
    const handleWalletEvents = () => {
      if ((window as any).solana) {
        // Listen for wallet disconnection
        (window as any).solana.on('disconnect', () => {
          console.log('Wallet disconnected externally');
          setWalletInfo(null);
          // Note: We don't clear from Firebase here as user might want to reconnect
        });

        // Listen for account changes
        (window as any).solana.on('accountChanged', async (publicKey: any) => {
          if (publicKey && walletInfo) {
            console.log('Wallet account changed');
            const newPublicKey = publicKey.toString();
            
            // Update wallet info if account changed
            if (newPublicKey !== walletInfo.publicKey) {
              const updatedWallet: WalletInfo = {
                address: `${newPublicKey.slice(0, 6)}...${newPublicKey.slice(-4)}`,
                publicKey: newPublicKey,
                connected: true,
                lastConnected: Date.now()
              };
              setWalletInfo(updatedWallet);
              await storeWallet(updatedWallet);
            }
          }
        });
      }
    };

    // Set up wallet event listeners when wallet extension is available
    if ((window as any).solana) {
      handleWalletEvents();
    } else {
      // Wait for wallet to be available
      const checkWallet = setInterval(() => {
        if ((window as any).solana) {
          handleWalletEvents();
          clearInterval(checkWallet);
        }
      }, 1000);
      
      return () => clearInterval(checkWallet);
    }
  }, [walletInfo]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    userProfile,
    walletInfo,
    loading,
    isWalletConnected: !!(walletInfo?.connected),
    signIn,
    signUp,
    signOut,
    connectWallet,
    disconnectWallet,
    getStoredWallet
  }), [currentUser, userProfile, walletInfo, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 