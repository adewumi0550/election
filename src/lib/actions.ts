
'use server';

import type { Admin, Ballot, Candidate, Election, Office, Vote, Voter, ElectionResult } from './types';
import { revalidatePath } from 'next/cache';

// AUTH ACTIONS
export async function signUpAndCreateAdmin(params: any): Promise<{ success: boolean; error?: string }> {
    console.log('signUpAndCreateAdmin called. Firebase is not configured.');
    return { success: false, error: "Firebase not configured." };
}


// ELECTION ACTIONS
export async function createElection(data: { title: string, description: string, startTime: Date, endTime: Date }) {
    console.log('createElection called. Firebase is not configured.');
    revalidatePath('/admin/elections');
    return { id: `new-election-${Date.now()}` };
}

export async function updateElection(id: string, data: Partial<Election>) {
    console.log('updateElection called. Firebase is not configured.');
    revalidatePath(`/admin/elections`);
    revalidatePath(`/admin/elections/edit/${id}`);
}

// CANDIDATE ACTIONS
export async function addCandidate(data: Omit<Candidate, 'id'>) {
    console.log('addCandidate called. Firebase is not configured.');
    revalidatePath(`/admin/candidates?electionId=${data.electionId}`);
}

export async function updateCandidate(id: string, data: Partial<Candidate>) {
    console.log('updateCandidate called. Firebase is not configured.');
    revalidatePath(`/admin/candidates`);
}

export async function deleteCandidate(id: string) {
    console.log('deleteCandidate called. Firebase is not configured.');
    revalidatePath('/admin/candidates');
}


// VOTER ACTIONS
export async function addVoter(data: Omit<Voter, 'id'>) {
    console.log('addVoter called. Firebase is not configured.');
    revalidatePath(`/admin/elections/edit/${data.electionId}`);
}

export async function deleteVoter(id: string) {
    console.log('deleteVoter called. Firebase is not configured.');
}


// VOTING ACTIONS
export async function submitVote(payload: { electionId: string, voterId: string, ballot: Ballot }): Promise<{ success: boolean; message: string }> {
    console.log("submitVote called. Firebase is not configured.");
    return { success: false, message: 'Voting is currently disabled. Please configure Firebase.' };
}


// SERVER-SIDE QUERIES

export async function getElections(): Promise<Election[]> {
  console.log("getElections called. Firebase is not configured. Returning empty array.");
  return [];
}

export async function getElection(id: string): Promise<Election | undefined> {
  console.log("getElection called. Firebase is not configured. Returning undefined.");
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
    console.log("getCandidates called. Firebase is not configured. Returning empty array.");
    return [];
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  console.log("getCandidate called. Firebase is not configured. Returning undefined.");
  return undefined;
}

export async function getVoters(electionId: string): Promise<Voter[]> {
    console.log("getVoters called. Firebase is not configured. Returning empty array.");
    return [];
}


export async function getElectionResults(electionId: string): Promise<ElectionResult[]> {
    console.log("getElectionResults called. Firebase is not configured. Returning empty array.");
    return [];
}
