
'use server';

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// This function safely retrieves and sanitizes Firebase Admin credentials.
function getFirebaseCredentials() {
  try {
    const serviceAccountJson = require('../../firebase-service-account.json');
    
    const serviceAccount: ServiceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || serviceAccountJson.project_id,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || serviceAccountJson.client_email,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || serviceAccountJson.private_key).replace(/\\n/g, '\n')
    };
    
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error("Missing Firebase Admin credentials in environment variables or service account file.");
    }
    
    return serviceAccount;
  } catch (error) {
     console.error("Could not load or parse Firebase credentials. Make sure firebase-service-account.json exists or environment variables are set.", error);
     throw new Error("Failed to load Firebase admin credentials.");
  }
}

if (!admin.apps.length) {
  try {
    const credentials = getFirebaseCredentials();
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
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
