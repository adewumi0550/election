import { getElection, getElections, getElectionResults } from '@/lib/data';
import ResultsChart from '@/components/results-chart';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';

export default async function ResultsPage({ searchParams }: { searchParams: { electionId?: string }}) {
    const elections = await getElections();
    const electionId = searchParams.electionId || elections[0]?.id;
    
    if (!electionId) {
        return <div className="container mx-auto p-4 md:p-8">No election found.</div>
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Suspense fallback={<ResultsSkeleton />}>
                <ResultsDisplay electionId={electionId} />
            </Suspense>
        </div>
    );
}

async function ResultsDisplay({ electionId }: { electionId: string }) {
    const election = await getElection(electionId);
    if (!election) {
       return <div className="container mx-auto p-4 md:p-8">Election not found.</div>
    }

    const results = await getElectionResults(electionId);
    const hasElectionEnded = new Date() >= new Date(election.endTime);

    return <>
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
                These are preliminary results. Final results will be available after the election ends on {new Date(election.endTime).toLocaleString()}.
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
    </>
}

function ResultsSkeleton() {
    return (
        <div>
            <div className="mb-8">
                <div className="h-9 w-1/2 bg-muted rounded-md mb-2 animate-pulse"></div>
                <div className="h-5 w-1/3 bg-muted rounded-md animate-pulse"></div>
            </div>
             <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-7 w-1/4 bg-muted rounded-md animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-40 bg-muted rounded-md animate-pulse"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}