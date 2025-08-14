
import { auth as serverAuth } from '@/lib/firebase-admin';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db as adminDb } from '@/lib/firebase-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function CreateAdminPage() {
    const email = "emeralddeveloper360@gmail.com";
    const password = "12345678";
    const displayName = "saheed";
    let message = "";
    let userRecord;

    try {
        // 1. Create user in Firebase Auth
        try {
            userRecord = await serverAuth.getUserByEmail(email);
            message = `Auth user for ${email} already exists. `;
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await serverAuth.createUser({
                    email,
                    password,
                    displayName,
                });
                message = `Successfully created auth user for ${email}. `;
            } else {
                throw error; // Re-throw other auth errors
            }
        }

        // 2. Create/update user document in Firestore 'admins' collection
        const adminsCollection = collection(adminDb, 'admins');
        const adminDocRef = doc(adminsCollection, userRecord.uid);
        
        await setDoc(adminDocRef, {
            uid: userRecord.uid,
            name: displayName,
            email: email,
            status: true,
            verified: true,
            restricted: false,
        });

        message += `Successfully created/updated Firestore admin document. You can now log in.`;

    } catch (error: any) {
        console.error("Failed to create special admin:", error);
        message = `An error occurred: ${error.message}`;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Special Admin Creation</CardTitle>
                    <CardDescription>
                        This page attempts to create a default admin user for testing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        <strong>Status:</strong> {message}
                    </p>
                    <Link href="/admin-login" className="text-primary hover:underline">
                        Proceed to Login &rarr;
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
