import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Candidate, Election, Office } from './types';

// CLIENT-SIDE QUERIES

export async function getElectionsClient(): Promise<Election[]> {
  const electionsSnapshot = await getDocs(collection(db, 'elections'));
  return electionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startTime: (doc.data().startTime as Timestamp).toDate(),
    endTime: (doc.data().endTime as Timestamp).toDate(),
  } as Election)).sort((a,b) => b.startTime.getTime() - a.startTime.getTime());
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
  // In a real app, you might fetch this from Firestore as well
  return Promise.resolve(fixedOffices.sort((a, b) => a.order - b.order));
}

export async function getCandidatesClient(electionId?: string): Promise<Candidate[]> {
    if (!electionId) return [];
    const q = query(collection(db, 'candidates'), where('electionId', '==', electionId));
    const candidatesSnapshot = await getDocs(q);
    return candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
}
