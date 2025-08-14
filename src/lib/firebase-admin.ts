
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// This is a workaround to ensure the service account details are available.
// In a production environment, these should be securely managed as environment variables.
const serviceAccount: ServiceAccount = {
    projectId: "voting-app-b7606",
    clientEmail: "firebase-adminsdk-i4j1g@voting-app-b7606.iam.gserviceaccount.com",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "your-private-key-fallback"
};

// Replace the placeholder with the actual private key, ensuring newlines are correctly formatted.
const private_key = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n');

const credential = {
    project_id: serviceAccount.projectId,
    client_email: serviceAccount.clientEmail,
    private_key: private_key
}


const app = !getApps().length ? initializeApp({ credential: cert(credential) }) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
