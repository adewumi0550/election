
import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// This is a workaround to ensure the service account details are available.
// In a production environment, these should be securely managed as environment variables.
const serviceAccount: ServiceAccount = {
    projectId: "voting-app-b7606",
    clientEmail: "firebase-adminsdk-i4j1g@voting-app-b7606.iam.gserviceaccount.com",
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n')
};


const app = !getApps().length ? initializeApp({ credential: cert(serviceAccount) }) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
