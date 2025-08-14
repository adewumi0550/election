import { getElection, getElectionResults } from '@/lib/data';
import ResultsChart from '@/components/results-chart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ResultsPage() {
  const election = await getElection();
  const results = await getElectionResults();
  const hasElectionEnded = new Date() >= election.endTime;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Election Results
        </h1>
        <p className="text-muted-foreground">
          Live results for the {election.title}.
        </p>
      </div>

      {!hasElectionEnded && (
        <Card className="mb-8 text-center p-8 bg-accent">
          <CardTitle className="text-2xl text-accent-foreground">Results are not yet final.</CardTitle>
          <CardDescription className="mt-2 text-accent-foreground/80">
            These are preliminary results. Final results will be available after the election ends on {election.endTime.toLocaleString()}.
          </CardDescription>
        </Card>
      )}

      <div className="space-y-8">
        {results.map(officeResult => (
          <Card key={officeResult.officeId}>
            <CardHeader>
              <CardTitle>{officeResult.officeName}</CardTitle>
            </CardHeader>
            <CardContent>
              {officeResult.results.reduce((sum, r) => sum + r.votes, 0) > 0 ? (
                <ResultsChart data={officeResult.results} />
              ) : (
                <p className='text-muted-foreground'>No votes have been cast for this office yet.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
