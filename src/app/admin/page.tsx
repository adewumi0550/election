
import { getCandidates, getElections, getElectionResults } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Vote, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Election } from '@/lib/types';

export default async function AdminDashboardPage() {
    const elections = await getElections();
    const activeElection: Election | undefined = elections.find(e => new Date(e.startTime) <= new Date() && new Date(e.endTime) >= new Date()) || elections[0];

    const candidates = activeElection ? await getCandidates(activeElection.id) : [];
    const results = activeElection ? await getElectionResults(activeElection.id) : [];

    const totalVotes = results.reduce((total, office) => 
        total + office.results.reduce((officeTotal, cand) => officeTotal + cand.votes, 0), 0);
    
    const getElectionStatus = (election: any) => {
        if (!election) return 'N/A';
        const now = new Date();
        const startTime = new Date(election.startTime);
        const endTime = new Date(election.endTime);
        if (now < startTime) return 'Upcoming';
        if (now > endTime) return 'Ended';
        return 'In Progress';
    }

    const electionStatus = getElectionStatus(activeElection);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
                Admin Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
                Overview for {activeElection ? `"${activeElection.title}"` : 'the latest election'}.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
                        <Vote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVotes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Registered Candidates</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{candidates.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Election Status</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{electionStatus}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href="/admin/elections">Manage Elections</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/candidates">Manage Candidates</Link>
                    </Button>
                     {activeElection && (
                        <Button asChild variant="outline">
                            <Link href={`/results?electionId=${activeElection.id}`}>View Live Results</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
