'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, auth, db } from '@/lib/firebase';
import { signUpAndCreateAdmin } from '@/lib/actions';
import type { Admin } from '@/lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  adminData: Admin | null;
  loading: boolean;
  error: string | null;
  signUp: (params: any) => Promise<any>;
  signIn: (params: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            setAdminData(adminDoc.data() as Admin);
          } else {
            setAdminData(null);
            // Optionally sign out if no admin record found
            // await firebaseSignOut(auth);
          }
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch user data." });
            setAdminData(null);
        }
      } else {
        setUser(null);
        setAdminData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUpAndCreateAdmin(params);
      if (result.success) {
        toast({ title: "Success", description: "Account created successfully. You can now log in." });
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
      return result;
    } catch (e: any) {
      setError(e.message);
      toast({ variant: "destructive", title: "Sign Up Failed", description: e.message });
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (params: any) => {
    setLoading(true);
    setError(null);
    const { email, password } = params;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting user and adminData
      return { success: true, data: userCredential.user };
    } catch (e: any) {
      setError(e.message);
      toast({ variant: "destructive", title: "Sign In Failed", description: e.message });
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will clear user and adminData
    } catch (e: any) {
      setError(e.message);
      toast({ variant: "destructive", title: "Sign Out Failed", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions." });
        return { success: true };
    } catch (e: any) {
        setError(e.message);
        toast({ variant: "destructive", title: "Password Reset Failed", description: e.message });
        return { success: false, error: e.message };
    } finally {
        setLoading(false);
    }
  }

  const value = {
    user,
    adminData,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
