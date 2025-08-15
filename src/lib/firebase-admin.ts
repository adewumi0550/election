'use server';

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// This function robustly gets credentials from environment variables,
// falling back to a local JSON file for development. It also sanitizes the private key.
function getCreds(): ServiceAccount {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        try {
            const serviceAccount = require('../../firebase-service-account.json');
            if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
                 throw new Error("Service account JSON is missing required fields.");
            }
            return {
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                privateKey: serviceAccount.private_key,
            }
        } catch (e) {
             throw new Error(
                'Missing Firebase Admin credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your .env file, or a valid firebase-service-account.json is present at the root of your project for local development.'
             );
        }
    }
    
    // Sanitize the private key
    privateKey = privateKey.replace(/\\n/g, '\n');

    return {
        projectId,
        clientEmail,
        privateKey,
    };
}


// Prevent re-initialization in modern server environments (like Next.js)
const app = admin.apps.length
  ? admin.apps[0]
  : admin.initializeApp({
      credential: admin.credential.cert(getCreds()),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });


export const adminAuth = app.auth();
export const adminDb = app.firestore();
export const adminStorage = app.storage();
