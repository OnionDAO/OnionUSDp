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
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, additionalData: any) => Promise<UserProfile>;
  signOut: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

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
      return profile; // Return the profile so the component knows it's ready
    } catch (error) {
      console.error('Sign up error:', error);
      throw error; // Re-throw the error so the component can handle it
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('User signed in, fetching profile...');
      // Wait a bit for the onAuthStateChanged to trigger and fetch profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sign in completed');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error; // Re-throw the error so the component can handle it
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
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
      } else {
        console.warn('No user profile document found for UID:', user.uid);
        console.log('Creating default employee profile for user');
        
        // Create a default employee profile
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
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 