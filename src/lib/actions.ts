'use server';

import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  writeBatch,
  Timestamp,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth as clientAuth } from './firebase';
import { adminAuth, adminDb } from './firebase-admin';
import type { Candidate, Election, Office, Voter, Ballot, ElectionResult } from './types';
import { revalidatePath } from 'next/cache';

// --- Election Actions ---

export async function getElections(): Promise<Election[]> {
  const electionsSnapshot = await getDocs(query(collection(db, 'elections'), orderBy('startTime', 'desc')));
  return electionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startTime: (doc.data().startTime as Timestamp).toDate(),
    endTime: (doc.data().endTime as Timestamp).toDate(),
  } as Election));
}

export async function getElection(id: string): Promise<Election | null> {
    const docRef = doc(db, 'elections', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        startTime: (data.startTime as Timestamp).toDate(),
        endTime: (data.endTime as Timestamp).toDate(),
    } as Election;
}

export async function createElection(data: Omit<Election, 'id'>) {
  const electionRef = await addDoc(collection(db, 'elections'), {
    ...data,
    startTime: Timestamp.fromDate(new Date(data.startTime)),
    endTime: Timestamp.fromDate(new Date(data.endTime)),
  });
  revalidatePath('/admin/elections');
  return { id: electionRef.id };
}

export async function updateElection(id: string, data: Partial<Election>) {
  await updateDoc(doc(db, 'elections', id), {
    ...data,
    startTime: data.startTime ? Timestamp.fromDate(new Date(data.startTime)) : undefined,
    endTime: data.endTime ? Timestamp.fromDate(new Date(data.endTime)) : undefined,
  });
  revalidatePath('/admin/elections');
  revalidatePath(`/admin/elections/edit/${id}`);
}

// --- Office Actions ---

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


// --- Candidate Actions ---

export async function getCandidates(electionId: string): Promise<Candidate[]> {
  if (!electionId) return [];
  const q = query(collection(db, 'candidates'), where('electionId', '==', electionId));
  const candidatesSnapshot = await getDocs(q);
  return candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
}

export async function getCandidate(id: string): Promise<Candidate | null> {
    const docRef = doc(db, 'candidates', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Candidate;
}

export async function addCandidate(data: Omit<Candidate, 'id'>) {
  await addDoc(collection(db, 'candidates'), data);
  revalidatePath('/admin/candidates');
}

export async function updateCandidate(id: string, data: Partial<Candidate>) {
  await updateDoc(doc(db, 'candidates', id), data);
  revalidatePath('/admin/candidates');
  revalidatePath(`/admin/candidates/edit/${id}`);
}

export async function deleteCandidate(id: string) {
  await deleteDoc(doc(db, 'candidates', id));
  revalidatePath('/admin/candidates');
}


// --- Voter Actions ---
export async function getVoters(electionId: string): Promise<Voter[]> {
    const q = query(collection(db, 'voters'), where('electionId', '==', electionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voter));
}

export async function addVoter(data: Omit<Voter, 'id'>) {
    await addDoc(collection(db, 'voters'), data);
    revalidatePath('/admin/elections/edit/' + data.electionId);
}

export async function deleteVoter(id: string) {
    const voterDoc = await getDoc(doc(db, 'voters', id));
    const electionId = voterDoc.data()?.electionId;
    await deleteDoc(doc(db, 'voters', id));
    if (electionId) {
        revalidatePath('/admin/elections/edit/' + electionId);
    }
}

// --- Voting Actions ---

export async function submitVote({ electionId, voterId, ballot }: { electionId: string, voterId: string, ballot: Ballot }) {
  try {
    return await runTransaction(db, async (transaction) => {
      // 1. Verify voter exists for this election
      const voterQuery = query(collection(db, 'voters'), where('electionId', '==', electionId), where('matric', '==', voterId));
      const voterSnapshot = await transaction.get(voterQuery);
      
      if (voterSnapshot.empty) {
        throw new Error("Voter with the provided Matric/Username not found for this election.");
      }
      
      const voterDoc = voterSnapshot.docs[0];

      // 2. Check if this voter has already voted
      const voteQuery = query(collection(db, 'votes'), where('electionId', '==', electionId), where('voterId', '==', voterDoc.id));
      const voteSnapshot = await transaction.get(voteQuery);

      if (!voteSnapshot.empty) {
        throw new Error("This voter has already submitted a ballot for this election.");
      }

      // 3. Record the vote
      const voteRef = doc(collection(db, 'votes'));
      transaction.set(voteRef, {
        electionId,
        voterId: voterDoc.id,
        ballot,
        createdAt: Timestamp.now(),
      });

      // 4. Increment vote counts for each candidate
      for (const officeId in ballot) {
        const candidateId = ballot[officeId];
        const candidateRef = doc(db, 'candidates', candidateId);
        
        const resultQuery = query(collection(db, 'results'), 
            where('electionId', '==', electionId), 
            where('officeId', '==', officeId),
            where('candidateId', '==', candidateId)
        );
        const resultSnapshot = await transaction.get(resultQuery);

        if (resultSnapshot.empty) {
            // First vote for this candidate
            const resultRef = doc(collection(db, 'results'));
            transaction.set(resultRef, {
                electionId,
                officeId,
                candidateId,
                votes: 1
            });
        } else {
            // Increment existing vote count
            const resultDoc = resultSnapshot.docs[0];
            const currentVotes = resultDoc.data().votes || 0;
            transaction.update(resultDoc.ref, { votes: currentVotes + 1 });
        }
      }

      return { success: true, message: "Vote cast successfully!" };
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getElectionResults(electionId: string): Promise<ElectionResult[]> {
    const offices = await getOffices();
    const candidates = await getCandidates(electionId);
    
    const resultsQuery = query(collection(db, 'results'), where('electionId', '==', electionId));
    const resultsSnapshot = await getDocs(resultsQuery);
    
    const votesByCandidate: { [candidateId: string]: number } = {};
    resultsSnapshot.forEach(doc => {
        const data = doc.data();
        votesByCandidate[data.candidateId] = data.votes;
    });

    const resultsByOffice: ElectionResult[] = offices.map(office => {
        const officeCandidates = candidates.filter(c => c.officeId === office.id);
        return {
            officeId: office.id,
            officeName: office.name,
            results: officeCandidates.map(candidate => ({
                candidateId: candidate.id,
                candidateName: candidate.fullName,
                votes: votesByCandidate[candidate.id] || 0
            })).sort((a,b) => b.votes - a.votes)
        };
    });

    return resultsByOffice;
}

// --- Admin/Auth Actions ---

export async function signUpAndCreateAdmin({ name, email, password }: any) {
    try {
        const userCredential = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        const uid = userCredential.uid;
        
        await adminDb.collection('admins').doc(uid).set({
            uid,
            name,
            email,
            status: true,
            verified: false,
            restricted: false,
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}