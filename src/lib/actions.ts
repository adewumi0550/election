
'use server';

import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db as adminDb } from './firebase-admin';
import type { Ballot, Candidate, Election, Voter } from './types';
import { revalidatePath } from 'next/cache';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app as clientApp } from './firebase';

const storage = getStorage(clientApp);


// ELECTION ACTIONS
export async function createElection(data: { title: string, description: string, startTime: Date, endTime: Date }) {
    const electionsCollection = collection(adminDb, 'elections');
    const docRef = await addDoc(electionsCollection, {
        ...data,
        createdAt: new Date(),
    });
    revalidatePath('/admin/elections');
    return { id: docRef.id };
}

export async function updateElection(id: string, data: Partial<Election>) {
    const electionDoc = doc(adminDb, 'elections', id);
    await setDoc(electionDoc, data, { merge: true });
    revalidatePath(`/admin/elections`);
    revalidatePath(`/admin/elections/edit/${id}`);
}

// CANDIDATE ACTIONS
async function uploadPhoto(photoBase64: string, candidateName: string): Promise<string> {
    const storageRef = ref(storage, `candidates/${candidateName}-${Date.now()}`);
    const snapshot = await uploadString(storageRef, photoBase64, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export async function addCandidate(data: Omit<Candidate, 'id'>) {
    const { photoUrl, ...candidateData } = data;
    const finalPhotoUrl = await uploadPhoto(photoUrl, data.fullName);

    const candidatesCollection = collection(adminDb, 'candidates');
    await addDoc(candidatesCollection, { ...candidateData, photoUrl: finalPhotoUrl });
    revalidatePath(`/admin/candidates?electionId=${data.electionId}`);
}

export async function updateCandidate(id: string, data: Partial<Candidate>) {
    const candidateDoc = doc(adminDb, 'candidates', id);
    await setDoc(candidateDoc, data, { merge: true });
    revalidatePath(`/admin/candidates`);
}

export async function deleteCandidate(id: string) {
    const candidateDoc = doc(adminDb, 'candidates', id);
    await deleteDoc(candidateDoc);
    revalidatePath('/admin/candidates');
}


// VOTER ACTIONS
export async function addVoter(data: Omit<Voter, 'id'>) {
    const votersCollection = collection(adminDb, 'voters');
    await addDoc(votersCollection, data);
    revalidatePath(`/admin/elections/edit/${data.electionId}`);
}

export async function deleteVoter(id: string) {
    const voterDoc = doc(adminDb, 'voters', id);
    await deleteDoc(voterDoc);
    // Revalidation will be handled by the calling server action
}


// VOTING ACTIONS
export async function submitVote(payload: { electionId: string, voterId: string, ballot: Ballot }): Promise<{ success: boolean; message: string }> {
    const { electionId, voterId, ballot } = payload;
    
    try {
        // 1. Verify Voter
        const votersCollection = collection(adminDb, 'voters');
        const voterQuery = query(votersCollection, where('matric', '==', voterId), where('electionId', '==', electionId));
        const voterSnapshot = await getDocs(voterQuery);

        if (voterSnapshot.empty) {
            return { success: false, message: 'Voter with this Matric/Username not found for this election.' };
        }

        const voterDoc = voterSnapshot.docs[0];

        // 2. Check if voter has already voted
        const votesCollection = collection(adminDb, 'votes');
        const voteQuery = query(votesCollection, where('voterId', '==', voterDoc.id), where('electionId', '==', electionId));
        const voteSnapshot = await getDocs(voteQuery);

        if (!voteSnapshot.empty) {
            return { success: false, message: 'This voter has already cast their ballot in this election.' };
        }

        // 3. Record the vote
        await addDoc(votesCollection, {
            electionId,
            voterId: voterDoc.id, // Use the document ID for the relation
            ballot,
            createdAt: new Date(),
        });

        revalidatePath(`/results?electionId=${electionId}`);
        return { success: true, message: 'Vote successfully recorded.' };

    } catch (error: any) {
        console.error("Error submitting vote:", error);
        return { success: false, message: 'An internal error occurred. Please try again.' };
    }
}
