
'use server';

import admin from 'firebase-admin';
import serviceAccount from '../../firebase-service-account.json';

if (!admin.apps.length) {
  try {
    // The type assertion is necessary because the JSON file is not a module.
    const typedServiceAccount = serviceAccount as admin.ServiceAccount;

    // Correctly format the private key by replacing the literal \\n with actual newlines.
    // This is the definitive fix for the "Invalid PEM formatted message" error.
    const privateKey = typedServiceAccount.private_key?.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        ...typedServiceAccount,
        private_key: privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error);
    // Throw a more specific error to help with debugging.
    throw new Error('Failed to initialize Firebase Admin SDK. Original error: ' + error.message);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
