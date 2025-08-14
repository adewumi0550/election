
'use server';

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, setDoc } from 'firebase/firestore';
import { db as adminDb, auth as serverAuth } from './firebase-admin';
import { db as clientDb } from './firebase';
import type { Candidate, Election, Office, Vote, Ballot, ElectionResult, Voter, Admin } from './types';

// CLIENT-SIDE SAFE FUNCTIONS
export async function getElectionsClient(): Promise<Election[]> {
  const electionsCollection = collection(clientDb, 'elections');
  const snapshot = await getDocs(electionsCollection);
  const elections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), startTime: doc.data().startTime.toDate(), endTime: doc.data().endTime.toDate() } as Election));
  return elections.sort((a,b) => b.startTime.getTime() - a.startTime.getTime());
}

export async function getOfficesClient(): Promise<Office[]> {
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


// ADMIN API
export async function createAdminUser(name: string, email: string, pass: string): Promise<{ success: boolean; message: string; }> {
    const userRecord = await serverAuth.createUser({
        email,
        password: pass,
        displayName: name,
    });
    
    const adminsCollection = collection(adminDb, 'admins');

    const adminData: Admin = {
        uid: userRecord.uid,
        name,
        email,
        status: false,
        verified: false,
        restricted: true,
    };

    await setDoc(doc(adminsCollection, userRecord.uid), adminData);

    return { success: true, message: 'Account created. Please wait for admin approval.' };
}

export async function getAdminUser(uid: string): Promise<Admin | null> {
    const docRef = doc(adminDb, 'admins', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Admin;
    }
    return null;
}


// ELECTION API
export async function getElections(): Promise<Election[]> {
  const electionsCollection = collection(adminDb, 'elections');
  const snapshot = await getDocs(electionsCollection);
  const elections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Election));
  return elections.sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export async function getElection(id: string): Promise<Election | undefined> {
  const docRef = doc(adminDb, 'elections', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Election;
  }
  return undefined;
}

export async function createElection(election: Omit<Election, 'id'>): Promise<Election> {
    const electionsCollection = collection(adminDb, 'elections');
    const docRef = await addDoc(electionsCollection, election);
    return { ...election, id: docRef.id };
}

export async function updateElection(id: string, data: Partial<Omit<Election, 'id'>>): Promise<Election | undefined> {
    const docRef = doc(adminDb, 'elections', id);
    await updateDoc(docRef, data);
    return getElection(id);
}


// OFFICE API
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

// CANDIDATE API
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


export async function addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
  const candidatesCollection = collection(adminDb, 'candidates');
  const docRef = await addDoc(candidatesCollection, candidate);
  return { ...candidate, id: docRef.id };
}

export async function updateCandidate(id: string, data: Partial<Omit<Candidate, 'id'>>): Promise<Candidate | undefined> {
    const docRef = doc(adminDb, 'candidates', id);
    await updateDoc(docRef, data);
    return getCandidate(id);
}

export async function deleteCandidate(id: string): Promise<{ success: boolean }> {
    const docRef = doc(adminDb, 'candidates', id);
    await deleteDoc(docRef);
    return { success: true };
}


// VOTE API
export async function submitVote(electionId: string, voterId: string, ballot: Ballot): Promise<{ success: boolean; message: string }> {
  // Use matric as voterId, but check for existing votes using matric.
  const votersCollection = collection(adminDb, 'voters');
  const votesCollection = collection(adminDb, 'votes');
  
  const voterQuery = query(votersCollection, where('matric', '==', voterId), where('electionId', '==', electionId));
  const voterSnapshot = await getDocs(voterQuery);
  
  if (voterSnapshot.empty) {
    return { success: false, message: 'Matric/Username not found in the voter roll for this election.' };
  }
  const voterDoc = voterSnapshot.docs[0];
  const voter = { id: voterDoc.id, ...voterDoc.data()} as Voter;

  const voteQuery = query(votesCollection, where('voterId', '==', voter.id), where('electionId', '==', electionId));
  const voteSnapshot = await getDocs(voteQuery);

  if (!voteSnapshot.empty) {
    return { success: false, message: 'You have already voted in this election.' };
  }

  const newVote: Omit<Vote, 'id'> = {
    voterId: voter.id, // Use the internal voter ID
    electionId,
    ballot,
    createdAt: new Date(),
  };
  await addDoc(votesCollection, newVote);
  return { success: true, message: 'Your vote has been cast successfully.' };
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

// VOTER API
export async function getVoters(electionId: string): Promise<Voter[]> {
    const votersCollection = collection(adminDb, 'voters');
    const q = query(votersCollection, where('electionId', '==', electionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voter));
}

export async function addVoter(voter: Omit<Voter, 'id'>): Promise<Voter> {
    const votersCollection = collection(adminDb, 'voters');
    const docRef = await addDoc(votersCollection, voter);
    return { ...voter, id: docRef.id };
}

export async function deleteVoter(id: string): Promise<{ success: boolean }> {
    const docRef = doc(adminDb, 'voters', id);
    await deleteDoc(docRef);
    return { success: true };
}
