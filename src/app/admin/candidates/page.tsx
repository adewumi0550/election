import { getElections, getOffices } from '@/lib/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import CandidateList from './candidate-list';
import AddCandidateForm from './add-candidate-form';

export default async function CandidatesPage({ searchParams }: { searchParams: { electionId?: string }}) {
    const elections = await getElections();
    
    // Default to the most recent election if no ID is provided
    const selectedElectionId = searchParams.electionId || (elections[0]?.id);

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Candidates</h1>
                <p className="text-muted-foreground">Add, edit, or remove candidates for a selected election.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Suspense fallback={<Card><CardHeader><CardTitle>Loading Form...</CardTitle></CardHeader><CardContent>...</CardContent></Card>}>
                        <AddCandidateFormWrapper electionId={selectedElectionId} elections={elections} />
                    </Suspense>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Candidates</CardTitle>
                             <CardDescription>
                                {selectedElectionId ? `Showing candidates for ${elections.find(e => e.id === selectedElectionId)?.title}` : 'No election selected'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Suspense fallback={<div>Loading candidates...</div>}>
                                <CandidateList electionId={selectedElectionId} />
                             </Suspense>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

async function AddCandidateFormWrapper({ electionId, elections }: { electionId: string; elections: any[] }) {
    const offices = await getOffices();
    return <AddCandidateForm offices={offices} elections={elections} selectedElectionId={electionId} />;
}
