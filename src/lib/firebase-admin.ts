
import admin from 'firebase-admin';

// --- VITAL: Environment Variable Check ---
// The `dev` script in package.json ensures that variables from `.env` are loaded.
if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  throw new Error(
    'Firebase Admin initialization failed. The environment variable FIREBASE_SERVICE_ACCOUNT_BASE64 is missing. ' +
    "Please encode your entire service account JSON file to base64 and set it as this variable in your project's .env file."
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

    // **CRITICAL FIX**: The private key in the JSON string contains literal "\\n" characters.
    // These must be replaced with actual newline characters for the SDK to parse the PEM key correctly.
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

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
