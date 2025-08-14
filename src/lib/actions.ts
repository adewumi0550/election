
'use server';

import type { Admin, Ballot, Candidate, Election, Office, Vote, Voter, ElectionResult } from './types';
import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth, adminStorage } from './firebase-admin';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, query, where, Timestamp } from 'firebase/firestore';
import { UserRecord } from 'firebase-admin/auth';
import { z } from 'zod';

// AUTH ACTIONS
export async function signUpAndCreateAdmin(params: any): Promise<{ success: boolean; error?: string; data?: any; }> {
    const { email, password, name } = params;
    try {
        const userRecord: UserRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        const adminData = {
            uid: userRecord.uid,
            name,
            email,
            status: true,
            verified: true,
            restricted: false,
        };

        await adminDb.collection('admins').doc(userRecord.uid).set(adminData);

        return { success: true, data: { uid: userRecord.uid } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


// ELECTION ACTIONS
export async function createElection(data: { title: string, description: string, startTime: Date, endTime: Date }) {
    const newElectionRef = await addDoc(collection(adminDb, 'elections'), {
      ...data,
      startTime: Timestamp.fromDate(data.startTime),
      endTime: Timestamp.fromDate(data.endTime),
    });
    revalidatePath('/admin/elections');
    return { id: newElectionRef.id };
}

export async function updateElection(id: string, data: Partial<Election>) {
    const electionRef = doc(adminDb, 'elections', id);
    const updateData: any = { ...data };
     if (data.startTime) {
        updateData.startTime = Timestamp.fromDate(new Date(data.startTime));
    }
    if (data.endTime) {
        updateData.endTime = Timestamp.fromDate(new Date(data.endTime));
    }

    await updateDoc(electionRef, updateData);
    revalidatePath(`/admin/elections`);
    revalidatePath(`/admin/elections/edit/${id}`);
}

// CANDIDATE ACTIONS
export async function addCandidate(data: Omit<Candidate, 'id'>) {
    await addDoc(collection(adminDb, 'candidates'), data);
    revalidatePath(`/admin/candidates?electionId=${data.electionId}`);
}

export async function updateCandidate(id: string, data: Partial<Candidate>) {
    const candidateRef = doc(adminDb, 'candidates', id);
    await updateDoc(candidateRef, data);
    revalidatePath(`/admin/candidates`);
}

export async function deleteCandidate(id: string) {
    const candidateRef = doc(adminDb, 'candidates', id);
    await deleteDoc(candidateRef);
    revalidatePath('/admin/candidates');
}


// VOTER ACTIONS
export async function addVoter(data: Omit<Voter, 'id'>) {
    // Check if voter with the same matric number already exists for this election
    const q = query(collection(adminDb, 'voters'), where('matric', '==', data.matric), where('electionId', '==', data.electionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("A voter with this Matric/Username already exists for this election.");
    }
    await addDoc(collection(adminDb, 'voters'), data);
    revalidatePath(`/admin/elections/edit/${data.electionId}`);
}

export async function deleteVoter(id: string) {
    await deleteDoc(doc(adminDb, 'voters', id));
}


// VOTING ACTIONS
export async function submitVote(payload: { electionId: string, voterId: string, ballot: Ballot }): Promise<{ success: boolean; message: string }> {
    const { electionId, voterId, ballot } = payload;
    
    const voterQuery = query(collection(adminDb, 'voters'), where('matric', '==', voterId), where('electionId', '==', electionId));
    const voterSnapshot = await getDocs(voterQuery);

    if (voterSnapshot.empty) {
        return { success: false, message: 'Voter with this Matric/Username not found for this election.' };
    }

    const voteQuery = query(collection(adminDb, 'votes'), where('voterId', '==', voterId), where('electionId', '==', electionId));
    const voteSnapshot = await getDocs(voteQuery);

    if (!voteSnapshot.empty) {
        return { success: false, message: 'You have already voted in this election.' };
    }

    await addDoc(collection(adminDb, 'votes'), {
        electionId,
        voterId,
        ballot,
        createdAt: Timestamp.now(),
    });

    return { success: true, message: 'Vote submitted successfully.' };
}


// SERVER-SIDE QUERIES

export async function getElections(): Promise<Election[]> {
  const electionsSnapshot = await getDocs(collection(adminDb, 'elections'));
  return electionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startTime: (doc.data().startTime as Timestamp).toDate(),
    endTime: (doc.data().endTime as Timestamp).toDate(),
  } as Election)).sort((a,b) => b.startTime.getTime() - a.startTime.getTime());
}

export async function getElection(id: string): Promise<Election | undefined> {
  const electionDoc = await getDoc(doc(adminDb, 'elections', id));
  if (!electionDoc.exists()) return undefined;
  const data = electionDoc.data();
  return {
      id: electionDoc.id,
      ...data,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
  } as Election
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
    if (!electionId) return [];
    const q = query(collection(adminDb, 'candidates'), where('electionId', '==', electionId));
    const candidatesSnapshot = await getDocs(q);
    return candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  const candidateDoc = await getDoc(doc(adminDb, 'candidates', id));
  return candidateDoc.exists() ? { id: candidateDoc.id, ...candidateDoc.data() } as Candidate : undefined;
}

export async function getVoters(electionId: string): Promise<Voter[]> {
    const q = query(collection(adminDb, 'voters'), where('electionId', '==', electionId));
    const votersSnapshot = await getDocs(q);
    return votersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voter));
}


export async function getElectionResults(electionId: string): Promise<ElectionResult[]> {
    const offices = await getOffices();
    const votesQuery = query(collection(adminDb, 'votes'), where('electionId', '==', electionId));
    const votesSnapshot = await getDocs(votesQuery);
    const votes = votesSnapshot.docs.map(doc => doc.data() as Vote);
    const candidates = await getCandidates(electionId);

    const results: ElectionResult[] = offices.map(office => {
        const officeCandidates = candidates.filter(c => c.officeId === office.id);
        const officeResults = officeCandidates.map(candidate => {
            const voteCount = votes.filter(v => v.ballot[office.id] === candidate.id).length;
            return {
                candidateId: candidate.id,
                candidateName: candidate.fullName,
                votes: voteCount,
            };
        });
        
        return {
            officeId: office.id,
            officeName: office.name,
            results: officeResults.sort((a,b) => b.votes - a.votes),
        };
    });

    return results;
}
