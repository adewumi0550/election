export interface Election {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface Office {
  id: string;
  name: string;
  order: number;
}

export interface Candidate {
  id: string;
  fullName: string;
  photoUrl: string;
  manifesto: string;
  officeId: string;
  'data-ai-hint'?: string;
  electionId: string;
}

export type Ballot = Record<string, string>; // officeId: candidateId

export interface Vote {
  id: string;
  voterId: string; // A unique identifier for the voter
  electionId: string;
  ballot: Ballot;
  createdAt: Date;
}

export interface ElectionResult {
    officeId: string;
    officeName: string;
    results: {
        candidateId: string;
        candidateName: string;
        votes: number;
    }[];
}

export interface Voter {
  id: string;
  name: string;
  email?: string;
  matric: string;
  level: string;
  electionId: string;
}

export interface Admin {
  uid: string;
  name: string;
  email: string;
  status: boolean;
  verified: boolean;
  restricted: boolean;
}
