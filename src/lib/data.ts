
'use server';

import type { Candidate, Election, Office, Vote, Ballot, ElectionResult, Voter } from './types';

// In-memory store
let elections: Election[] = [
    {
      id: 'election-2024',
      title: 'Student Union General Election 2024',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Default start time: 1 day ago
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Default end time: 2 days from now
    }
];

let offices: Office[] = [
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
  { id: 'sport-dir', name: 'Sport Director', order: 12 },
  { id: 'pro', name: 'Public Relation Officer', order: 13 },
  { id: 'health-1', name: 'Health Director 1', order: 14 },
  { id: 'health-2', name: 'Health Officer II', order: 15 },
  { id: 'food-dir', name: 'Food Directors', order: 16 },
];

let candidates: Candidate[] = [
    { id: 'cand-1', electionId: 'election-2024', fullName: 'Aisha Jibril', officeId: 'pres', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'Leading with integrity and vision for a better campus life for all students.' , 'data-ai-hint': 'woman portrait'},
    { id: 'cand-2', electionId: 'election-2024', fullName: 'Bello Musa', officeId: 'pres', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'A vote for me is a vote for progress, transparency, and student empowerment.' , 'data-ai-hint': 'man portrait'},
    { id: 'cand-3', electionId: 'election-2024', fullName: 'Fatima Abdullahi', officeId: 'vp', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'I will work tirelessly to support the president and serve the student body.' , 'data-ai-hint': 'woman smiling'},
    { id: 'cand-4', electionId: 'election-2024', fullName: 'Chinedu Okoro', officeId: 'vp', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'Experience and dedication you can count on. Let\'s build our future together.' , 'data-ai-hint': 'man glasses'},
    { id: 'cand-5', electionId: 'election-2024', fullName: 'Ngozi Eze', officeId: 'sec-gen', photoUrl: 'https://placehold.co/400x400.png', manifesto: 'Efficiency and clear communication will be the hallmark of my service as Secretary General.' , 'data-ai-hint': 'woman happy'},
];

let votes: Vote[] = [];
let voters: Voter[] = [];


// ELECTION API
export async function getElections(): Promise<Election[]> {
  return Promise.resolve(elections.sort((a,b) => b.startTime.getTime() - a.startTime.getTime()));
}

export async function getElection(id: string): Promise<Election | undefined> {
  return Promise.resolve(elections.find(e => e.id === id));
}

export async function createElection(election: Omit<Election, 'id'>): Promise<Election> {
    const newElection: Election = {
        ...election,
        id: `election-${Date.now()}`
    };
    elections.push(newElection);
    return Promise.resolve(newElection);
}

export async function updateElection(id: string, data: Partial<Omit<Election, 'id'>>): Promise<Election | undefined> {
    const electionIndex = elections.findIndex(e => e.id === id);
    if(electionIndex === -1) return undefined;
    elections[electionIndex] = { ...elections[electionIndex], ...data };
    return Promise.resolve(elections[electionIndex]);
}


// OFFICE API
export async function getOffices(): Promise<Office[]> {
  return Promise.resolve(offices.sort((a, b) => a.order - b.order));
}

// CANDIDATE API
export async function getCandidates(electionId?: string): Promise<Candidate[]> {
    if (electionId) {
        return Promise.resolve(candidates.filter(c => c.electionId === electionId));
    }
    return Promise.resolve(candidates);
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  return Promise.resolve(candidates.find(c => c.id === id));
}


export async function addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
  const newCandidate: Candidate = {
    ...candidate,
    id: `cand-${Date.now()}`,
  };
  candidates.push(newCandidate);
  return Promise.resolve(newCandidate);
}

export async function updateCandidate(id: string, data: Partial<Omit<Candidate, 'id'>>): Promise<Candidate | undefined> {
    const candidateIndex = candidates.findIndex(c => c.id === id);
    if (candidateIndex === -1) return undefined;
    candidates[candidateIndex] = { ...candidates[candidateIndex], ...data };
    return Promise.resolve(candidates[candidateIndex]);
}

export async function deleteCandidate(id: string): Promise<{ success: boolean }> {
    const initialLength = candidates.length;
    candidates = candidates.filter(c => c.id !== id);
    return Promise.resolve({ success: candidates.length < initialLength });
}


// VOTE API
export async function submitVote(electionId: string, voterId: string, ballot: Ballot): Promise<{ success: boolean; message: string }> {
  if (votes.some(v => v.voterId === voterId && v.electionId === electionId)) {
    return { success: false, message: 'You have already voted in this election.' };
  }

  const newVote: Vote = {
    id: `vote-${Date.now()}`,
    voterId,
    electionId,
    ballot,
    createdAt: new Date(),
  };
  votes.push(newVote);
  return { success: true, message: 'Your vote has been cast successfully.' };
}


export async function getElectionResults(electionId: string): Promise<ElectionResult[]> {
    const results: ElectionResult[] = [];

    for (const office of offices) {
        const officeResult: ElectionResult = {
            officeId: office.id,
            officeName: office.name,
            results: [],
        };

        const candidatesForOffice = candidates.filter(c => c.officeId === office.id && c.electionId === electionId);

        for (const candidate of candidatesForOffice) {
            const voteCount = votes.filter(v => v.electionId === electionId && v.ballot[office.id] === candidate.id).length;
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
    return Promise.resolve(voters.filter(v => v.electionId === electionId));
}

export async function addVoter(voter: Omit<Voter, 'id'>): Promise<Voter> {
    const newVoter: Voter = {
        ...voter,
        id: `voter-${Date.now()}`
    };
    voters.push(newVoter);
    return Promise.resolve(newVoter);
}

export async function deleteVoter(id: string): Promise<{ success: boolean }> {
    const initialLength = voters.length;
    voters = voters.filter(v => v.id !== id);
    return Promise.resolve({ success: voters.length < initialLength });
}
