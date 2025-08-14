
'use client';

import { useState, useEffect } from 'react';
import { getCandidatesClient, getElectionsClient, getOfficesClient } from '@/lib/queries';
import type { Candidate, Election, Office } from '@/lib/types';
import CountdownTimer from '@/components/countdown-timer';
import BallotForm from '@/components/ballot-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [electionsData, officesData] = await Promise.all([
          getElectionsClient(),
          getOfficesClient(),
        ]);
        setElections(electionsData);
        setOffices(officesData);
        
        const election = findCurrentElection(electionsData);
        if (election) {
          const candidatesData = await getCandidatesClient(election.id);
          setCandidates(candidatesData);
        }

      } catch (err: any) {
        console.error("Failed to fetch initial election data:", err);
        setError("Could not connect to the database. Please check your Firebase configuration and internet connection.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const findCurrentElection = (elections: Election[]) => {
    const now = new Date();
    const activeElection = elections.find(e => now >= new Date(e.startTime) && now < new Date(e.endTime));
    const upcomingElection = elections.filter(e => now < new Date(e.startTime)).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
    const latestEndedElection = elections.filter(e => now >= new Date(e.endTime)).sort((a,b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())[0];
    return activeElection || upcomingElection || latestEndedElection;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
     return (
       <div className="container mx-auto p-4 md:p-8">
        <Card className="text-center p-12">
            <CardTitle className="text-2xl text-destructive">Error Loading Election Data</CardTitle>
            <CardContent className="mt-4">
                <p className="text-muted-foreground">{error}</p>
            </CardContent>
        </Card>
      </div>
    )
  }
  
  const election = findCurrentElection(elections);

  if (!election) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="text-center p-12">
            <CardTitle className="text-2xl">No Elections Found</CardTitle>
            <CardContent className="mt-4">
                <p className="text-muted-foreground">There are no active or upcoming elections at the moment. Please check back later.</p>
            </CardContent>
        </Card>
      </div>
    )
  }

  const now = new Date();
  const isElectionRunning = now >= new Date(election.startTime) && now < new Date(election.endTime);
  const hasElectionEnded = now >= new Date(election.endTime);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {election.title}
          </h1>
          <p className="text-muted-foreground">
            Cast your vote for the future leaders of our university.
          </p>
        </div>
        <Card className="w-full md:w-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {hasElectionEnded ? 'Election Ended' : isElectionRunning ? 'Time Remaining' : 'Starts In'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountdownTimer endTime={isElectionRunning ? election.endTime : election.startTime} />
            </div>
            <p className="text-xs text-muted-foreground">
              {isElectionRunning ? 'until polls close' : 'until polls open'}
            </p>
          </CardContent>
        </Card>
      </div>

      {isElectionRunning ? (
        <BallotForm electionId={election.id} offices={offices} candidates={candidates} />
      ) : (
        <Card className="text-center p-12">
          <CardTitle className="text-2xl">
            {hasElectionEnded ? 'The election has ended.' : 'The election has not started yet.'}
          </CardTitle>
          <CardContent className="mt-4">
            <p className="text-muted-foreground mb-4">
              {hasElectionEnded 
                ? 'Thank you for your participation.' 
                : `Voting will begin on ${new Date(election.startTime).toLocaleString()}.`}
            </p>
            {hasElectionEnded && (
                 <Link href={`/results?electionId=${election.id}`} className="text-primary hover:underline">
                    View Final Results
                </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
