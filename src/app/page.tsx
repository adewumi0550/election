import { getCandidates, getElection, getOffices } from '@/lib/data';
import CountdownTimer from '@/components/countdown-timer';
import BallotForm from '@/components/ballot-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default async function HomePage() {
  const election = await getElection();
  const offices = await getOffices();
  const candidates = await getCandidates();

  const isElectionRunning = new Date() >= election.startTime && new Date() < election.endTime;
  const hasElectionEnded = new Date() >= election.endTime;

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
              {hasElectionEnded ? 'Election Ended' : 'Time Remaining'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountdownTimer endTime={election.endTime} />
            </div>
            <p className="text-xs text-muted-foreground">
              until polls close
            </p>
          </CardContent>
        </Card>
      </div>

      {isElectionRunning ? (
        <BallotForm offices={offices} candidates={candidates} />
      ) : (
        <Card className="text-center p-12">
          <CardTitle className="text-2xl">
            {hasElectionEnded ? 'The election has ended.' : 'The election has not started yet.'}
          </CardTitle>
          <CardContent className="mt-4">
            <p className="text-muted-foreground">
              {hasElectionEnded 
                ? 'Thank you for your participation. Results will be announced soon.' 
                : `Please check back on ${election.startTime.toLocaleString()}.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
