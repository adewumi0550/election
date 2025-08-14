
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAdminUser } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{success: boolean, message?: string}>;
  signOut: () => Promise<any>;
  sendPasswordResetEmail: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminUser = await getAdminUser(user.uid);
        if (adminUser && adminUser.status && !adminUser.restricted) {
          setUser(user);
        } else {
          // This case handles if an admin is manually disabled in Firestore.
          setUser(null); 
          await firebaseSignOut(auth);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string): Promise<{success: boolean, message?: string}> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const adminUser = await getAdminUser(userCredential.user.uid);
      
      if (!adminUser) {
        // This case should ideally not happen with the new registration flow, but is a good safeguard.
        await firebaseSignOut(auth);
        return { success: false, message: 'Admin account not found. Please register first.' };
      }
      if (adminUser.restricted || !adminUser.status) {
        await firebaseSignOut(auth);
        return { success: false, message: 'Your account has been disabled by an administrator.' };
      }
      
      return { success: true };

    } catch(error: any) {
        let message = 'An unexpected error occurred.';
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            message = 'Invalid email or password.';
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, message };
    }
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const sendPasswordResetEmail = (email: string) => {
      return firebaseSendPasswordResetEmail(auth, email);
  }

  const value = { user, loading, signIn, signOut, sendPasswordResetEmail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
