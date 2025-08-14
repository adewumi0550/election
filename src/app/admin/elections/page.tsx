import { getElections } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import type { Election } from '@/lib/types';

export default async function ElectionsPage() {
    const elections = await getElections();

    const getStatus = (startTime: Date, endTime: Date): JSX.Element => {
        const now = new Date();
        if (now < startTime) return <Badge variant="secondary">Upcoming</Badge>;
        if (now > endTime) return <Badge variant="outline">Ended</Badge>;
        return <Badge>In Progress</Badge>;
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Elections</h1>
                    <p className="text-muted-foreground">Create, view, and manage all elections.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/elections/new">
                        <PlusCircle className="mr-2"/>
                        Create Election
                    </Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>All Elections</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {elections.map((election: Election) => (
                                <TableRow key={election.id}>
                                    <TableCell>{election.title}</TableCell>
                                    <TableCell>{new Date(election.startTime).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(election.endTime).toLocaleString()}</TableCell>
                                    <TableCell>{getStatus(new Date(election.startTime), new Date(election.endTime))}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/admin/elections/edit/${election.id}`}>Manage</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
