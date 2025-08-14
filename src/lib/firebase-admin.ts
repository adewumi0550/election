
import admin from 'firebase-admin';

// --- VITAL: Environment Variable Check ---
// The Firebase Admin SDK needs these server-side environment variables to initialize.
// If any of these are missing, the initialization will fail.
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  // If required variables are missing, throw a detailed error.
  // This stops the app from crashing with a vague "Firebase app does not exist" error later on.
  throw new Error(
    `Firebase Admin initialization failed. The following environment variables are missing: ${missingEnvVars.join(', ')}. ` +
    "Please check your .env file and ensure you have copied the service account credentials correctly from your Firebase project settings."
  );
}
// -----------------------------------------

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to have its escaped newlines replaced with actual newlines.
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    // This catch block will now likely only catch unexpected initialization errors,
    // as the environment variable check above handles the most common failure case.
    console.error('Firebase admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK. See server logs for details.');
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
