'use server';

import type { Candidate, Election, Office, Vote, Ballot, ElectionResult } from './types';

// In-memory store
let election: Election = {
  id: 'election-2024',
  title: 'Student Union General Election 2024',
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default start time: 1 day from now
  endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Default end time: 3 days from now
};

let offices: Office[] = [
  { id: 'pres', name: 'President', order: 1 },
  { id: 'vp', name: 'Vice President', order: 2 },
  { id: 'sec-gen', name: 'Secretary General', order: 3 },
  { id: 'tres', name: 'Treasurer', order: 4 },
];

let candidates: Candidate[] = [
    { id: 'cand-1', fullName: 'Aisha Jibril', officeId: 'pres', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'Leading with integrity and vision for a better campus life for all students.' , 'data-ai-hint': 'woman portrait'},
    { id: 'cand-2', fullName: 'Bello Musa', officeId: 'pres', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'A vote for me is a vote for progress, transparency, and student empowerment.' , 'data-ai-hint': 'man portrait'},
    { id: 'cand-3', fullName: 'Fatima Abdullahi', officeId: 'vp', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'I will work tirelessly to support the president and serve the student body.' , 'data-ai-hint': 'woman smiling'},
    { id: 'cand-4', fullName: 'Chinedu Okoro', officeId: 'vp', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'Experience and dedication you can count on. Let\'s build our future together.' , 'data-ai-hint': 'man glasses'},
    { id: 'cand-5', fullName: 'Ngozi Eze', officeId: 'sec-gen', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'Efficiency and clear communication will be the hallmark of my service as Secretary General.' , 'data-ai-hint': 'woman happy'},
];

let votes: Vote[] = [];

// API Functions
export async function getElection(): Promise<Election> {
  return Promise.resolve(election);
}

export async function setElectionTime(startTime: Date, endTime: Date): Promise<Election> {
  election.startTime = startTime;
  election.endTime = endTime;
  return Promise.resolve(election);
}

export async function getOffices(): Promise<Office[]> {
  return Promise.resolve(offices.sort((a, b) => a.order - b.order));
}

export async function getCandidates(): Promise<Candidate[]> {
  return Promise.resolve(candidates);
}

export async function addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
  const newCandidate: Candidate = {
    ...candidate,
    id: `cand-${Date.now()}`,
  };
  candidates.push(newCandidate);
  return Promise.resolve(newCandidate);
}

export async function submitVote(voterId: string, ballot: Ballot): Promise<{ success: boolean; message: string }> {
  if (votes.some(v => v.voterId === voterId && v.electionId === election.id)) {
    return { success: false, message: 'You have already voted in this election.' };
  }

  const newVote: Vote = {
    id: `vote-${Date.now()}`,
    voterId,
    electionId: election.id,
    ballot,
    createdAt: new Date(),
  };
  votes.push(newVote);
  return { success: true, message: 'Your vote has been cast successfully.' };
}


export async function getElectionResults(): Promise<ElectionResult[]> {
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
