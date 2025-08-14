
'use server';

import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db as adminDb, auth as adminAuth} from './firebase-admin';
import type { Admin, Ballot, Candidate, Election, Office, Vote, Voter, ElectionResult } from './types';
import { revalidatePath } from 'next/cache';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app as clientApp } from './firebase';

const storage = getStorage(clientApp);


// AUTH ACTIONS
export async function signUpAndCreateAdmin(params: any) {
    const { email, password, name } = params;
    try {
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        const newAdmin: Admin = {
            uid: userRecord.uid,
            name: name,
            email: email,
            status: true,
            verified: true, // Auto-verified on creation
            restricted: false,
        };

        await adminDb.collection('admins').doc(userRecord.uid).set(newAdmin);

        return { success: true, uid: userRecord.uid };
    } catch (error: any) {
        let message = 'An unexpected error occurred.';
        if (error.code === 'auth/email-already-exists') {
            message = 'This email is already registered.';
        } else if (error.message) {
            message = error.message;
        }
        return { success: false, error: message };
    }
}


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


// SERVER-SIDE QUERIES

export async function getElections(): Promise<Election[]> {
  const electionsCollection = collection(adminDb, 'elections');
  const snapshot = await getDocs(electionsCollection);
  const elections = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          // Convert Firestore Timestamps to serializable Date objects
          startTime: data.startTime.toDate(), 
          endTime: data.endTime.toDate() 
      } as Election;
  });
  return elections.sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export async function getElection(id: string): Promise<Election | undefined> {
  const docRef = doc(adminDb, 'elections', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return { 
        id: docSnap.id, 
        ...data,
        startTime: data.startTime.toDate(),
        endTime: data.endTime.toDate()
    } as Election;
  }
  return undefined;
}


export async function getOffices(): Promise<Office[]> {
  const fixedOffices: Office[] = [
    { id: 'pres', name: 'President', order: 1 },
    { id: 'vp', name: 'Vice President', order: 2 },
    { id: 'sec-gen', name: 'Secretary General', order: 3 },
    { id: 'asst-sec-gen', name: 'Assistant Secretary General', order: 4 },
    { id: 'fin-sec', name: 'Financial secretary', order: 5 },
    { id: 'tres', name: 'Treasurer', order: 6 },
    { id: 'wel-1', name: 'Welfare Officer I', order: 7 },
    { id: 'wel-2', name: 'Welfare Officer II', order: 8 },
    { id: 'acad-dir', name: 'Academic Director', order: 9 },
    { id: 'soc-dir', name: 'Social Director', order: 10 },
    { id: 'sale-dir', name: 'Sale Director', order: 11 },
    { id: 'sport-dir', 'name': 'Sport Director', order: 12 },
    { id: 'pro', 'name': 'Public Relation Officer', order: 13 },
    { id: 'health-1', name: 'Health Director 1', order: 14 },
    { id: 'health-2', name: 'Health Officer II', order: 15 },
    { id: 'food-dir', name: 'Food Directors', order: 16 },
  ];
  return Promise.resolve(fixedOffices.sort((a, b) => a.order - b.order));
}

export async function getCandidates(electionId?: string): Promise<Candidate[]> {
    const candidatesCollection = collection(adminDb, 'candidates');
    let q = query(candidatesCollection);
    if (electionId) {
        q = query(candidatesCollection, where('electionId', '==', electionId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  const docRef = doc(adminDb, 'candidates', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Candidate;
  }
  return undefined;
}

export async function getVoters(electionId: string): Promise<Voter[]> {
    const votersCollection = collection(adminDb, 'voters');
    const q = query(votersCollection, where('electionId', '==', electionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voter));
}


export async function getElectionResults(electionId: string): Promise<ElectionResult[]> {
    const votesCollection = collection(adminDb, 'votes');
    const offices = await getOffices();
    const candidates = await getCandidates(electionId);
    const votesQuery = query(votesCollection, where('electionId', '==', electionId));
    const votesSnapshot = await getDocs(votesQuery);
    const votes = votesSnapshot.docs.map(doc => doc.data() as Vote);

    const results: ElectionResult[] = [];

    for (const office of offices) {
        const officeResult: ElectionResult = {
            officeId: office.id,
            officeName: office.name,
            results: [],
        };

        const candidatesForOffice = candidates.filter(c => c.officeId === office.id);

        for (const candidate of candidatesForOffice) {
            const voteCount = votes.filter(v => v.ballot[office.id] === candidate.id).length;
            officeResult.results.push({
                candidateId: candidate.id,
                candidateName: candidate.fullName,
                votes: voteCount,
            });
        }
        
        officeResult.results.sort((a, b) => b.votes - a.votes);
        results.push(officeResult);
    }
    
    results.sort((a,b) => offices.find(o => o.id === a.officeId)!.order - offices.find(o => o.id === b.officeId)!.order);

    return Promise.resolve(results);
}
