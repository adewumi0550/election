import { getCandidates, getElection, getElectionResults } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Vote, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboardPage() {
    const election = await getElection();
    const candidates = await getCandidates();
    const results = await getElectionResults();

    const totalVotes = results.reduce((total, office) => 
        total + office.results.reduce((officeTotal, cand) => officeTotal + cand.votes, 0), 0);

    const electionStatus = new Date() < election.startTime ? 'Upcoming' : new Date() > election.endTime ? 'Ended' : 'In Progress';

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">
                Admin Dashboard
            </h1>

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
                        <Link href="/admin/candidates">Manage Candidates</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/settings">Election Settings</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/results">View Live Results</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
