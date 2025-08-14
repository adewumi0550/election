
import admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// --- VITAL: Environment Variable Check ---
if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  throw new Error(
    'Firebase Admin initialization failed. The environment variable FIREBASE_SERVICE_ACCOUNT_BASE64 is missing. ' +
    "Please encode your entire service account JSON file to base64 and set it as this variable in your .env file."
  );
}

if (!admin.apps.length) {
  try {
    // Decode the base64-encoded service account key
    const serviceAccountJson = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      'base64'
    ).toString('utf8');
    
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    // This will now catch errors related to base64 decoding or JSON parsing, providing clearer feedback.
    console.error('Firebase admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK. Original error: ' + error.message);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
