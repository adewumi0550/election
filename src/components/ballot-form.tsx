'use client';

import { useState, useEffect } from 'react';
import type { Office, Candidate, Ballot } from '@/lib/types';
import CandidateCard from './candidate-card';
import { RadioGroup } from './ui/radio-group';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { submitVote } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BallotFormProps {
  offices: Office[];
  candidates: Candidate[];
  electionId: string;
}

export default function BallotForm({ offices, candidates, electionId }: BallotFormProps) {
  const [ballot, setBallot] = useState<Ballot>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(true); // Default to true to prevent flash of content
  const { toast } = useToast();
  
  const ELECTION_VOTED_KEY = `election-${electionId}-voted`;

  useEffect(() => {
    const votedStatus = localStorage.getItem(ELECTION_VOTED_KEY);
    setHasVoted(votedStatus === 'true');
  }, [ELECTION_VOTED_KEY]);

  const handleValueChange = (officeId: string, candidateId: string) => {
    setBallot((prev) => ({ ...prev, [officeId]: candidateId }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // In a real app, voterId would come from an auth system
    const voterId = `voter-${Math.random().toString(36).substring(7)}`; 

    const result = await submitVote(electionId, voterId, ballot);

    if (result.success) {
      localStorage.setItem(ELECTION_VOTED_KEY, 'true');
      setHasVoted(true);
      toast({
        title: "Vote Cast Successfully!",
        description: "Thank you for your participation. Your vote has been recorded.",
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Submission Failed",
        description: result.message,
      });
    }
    setIsLoading(false);
  };

  if (hasVoted) {
    return (
      <Card className="text-center p-12 bg-accent">
        <CardTitle className="text-2xl text-accent-foreground">Thank you for your participation!</CardTitle>
        <CardContent className="mt-4">
          <p className="text-accent-foreground/80">
            You have already cast your vote in this election.
          </p>
        </CardContent>
      </Card>
    );
  }

  const officesWithCandidates = offices.filter(office => candidates.some(c => c.officeId === office.id));
  const isBallotComplete = officesWithCandidates.length === Object.keys(ballot).length;


  return (
    <div className="space-y-8">
      {officesWithCandidates.map((office) => (
        <div key={office.id}>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{office.name}</h2>
          <RadioGroup onValueChange={(candidateId) => handleValueChange(office.id, candidateId)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates
                .filter((c) => c.officeId === office.id)
                .map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} officeId={office.id}/>
                ))}
            </div>
          </RadioGroup>
        </div>
      ))}
      <Card className="sticky bottom-4">
        <CardHeader>
            <CardTitle>Confirm and Cast Your Vote</CardTitle>
            <CardDescription>Please review your selections before submitting. This action is final and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="lg" disabled={!isBallotComplete || isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isBallotComplete ? 'Submit My Ballot' : 'Please Complete Your Ballot'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. Your ballot will be permanently cast.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Review Ballot</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Confirm and Cast Vote</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
