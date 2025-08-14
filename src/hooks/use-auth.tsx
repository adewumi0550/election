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
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection } from "firebase/firestore"; 
import { auth, db } from '@/lib/firebase';
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

async function getAdminUser(uid: string): Promise<Admin | null> {
    const docRef = doc(db, 'admins', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Admin;
    }
    return null;
}

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
      return { success: true, message: "Signed in successfully" };
    } catch (error: any) {
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        
        const newAdmin: Admin = {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            status: true,
            verified: true, // Auto-verified on creation for simplicity
            restricted: false,
        };

        await setDoc(doc(db, 'admins', userCredential.user.uid), newAdmin);
        
        return { success: true, message: 'Account created successfully! You can now log in.' };
    } catch (error: any) {
        let message = 'An unexpected error occurred.';
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already registered.';
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, message };
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
      return { success: false, message: error.message || 'An unknown error occurred.' };
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
