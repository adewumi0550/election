'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createAdminUser, getAdminUser } from '@/lib/data';
import type { Admin } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; message: string; }>;
  signUp: (email: string, pass: string, name: string) => Promise<{ success: boolean; message: string; }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const adminData = await getAdminUser(user.uid);
        if (adminData && adminData.status && adminData.verified) {
           setAdmin(adminData);
        } else {
           setAdmin(null);
           // Optional: sign out user if not a verified admin
           // firebaseSignOut(auth); 
        }
      } else {
        setUser(null);
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle the rest
      return { success: true, message: "Signed in successfully" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {
        const result = await createAdminUser(name, email, pass);
        return result;
    } catch (error: any) {
        return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  const value = { user, admin, loading, signIn, signUp, signOut, sendPasswordReset };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
