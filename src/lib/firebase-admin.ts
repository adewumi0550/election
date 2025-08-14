
import admin from 'firebase-admin';

// The Firebase Admin SDK initialization is currently disabled as it was causing
// persistent errors related to environment variable loading in this specific
// Next.js environment. The client-side Firebase SDK (in src/lib/firebase.ts)
// is still active and handles all current application functionality.
//
// If you need to enable server-side admin features in the future, you will
// need to ensure that your service account credentials are correctly
// available as environment variables when this code is executed. A robust
// way to do this is by setting the FIREBASE_SERVICE_ACCOUNT_BASE64 variable
// and using the commented-out code below.

/*
import { config } from 'dotenv';
config(); // Force load environment variables

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  throw new Error(
    'Firebase Admin initialization failed. The environment variable FIREBASE_SERVICE_ACCOUNT_BASE64 is missing. ' +
    "Please encode your entire service account JSON file to base64 and set it as this variable in your project's .env file."
  );
}

if (!admin.apps.length) {
  try {
    const serviceAccountJson = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      'base64'
    ).toString('utf8');
    
    const serviceAccount = JSON.parse(serviceAccountJson);

    // CRITICAL FIX: The private key in the JSON string contains literal "\\n" characters.
    // These must be replaced with actual newline characters for the SDK to parse the PEM key correctly.
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK. Original error: ' + error.message);
  }
}
*/

// Stub exports to prevent breaking other parts of the application
// that might import these.
export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as admin.auth.Auth);
export const adminDb = admin.apps.length > 0 ? admin.firestore() : ({} as admin.firestore.Firestore);
export const adminStorage = admin.apps.length > 0 ? admin.storage() : ({} as admin.storage.Storage);
