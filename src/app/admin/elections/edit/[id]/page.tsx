import { getElection, updateElection, getVoters, addVoter, deleteVoter } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ElectionForm from '../../election-form';
import { revalidatePath } from 'next/cache';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import VoterManagement from '../../voter-management';

export default async function EditElectionPage({ params }: { params: { id: string } }) {
    const election = await getElection(params.id);
    
    if (!election) {
        notFound();
    }
    
    const voters = await getVoters(election.id);

    async function handleUpdate(data: any) {
        'use server';
        await updateElection(params.id, data);
        revalidatePath(`/admin/elections/edit/${params.id}`);
        // No need to redirect, just let the page re-render with fresh data.
    }

    async function handleAddVoter(formData: FormData) {
        'use server';
        const name = formData.get('name') as string;
        const matric = formData.get('matric') as string;
        const level = formData.get('level') as string;
        const email = formData.get('email') as string;

        await addVoter({ name, matric, level, email, electionId: params.id });
        revalidatePath(`/admin/elections/edit/${params.id}`);
    }

    async function handleDeleteVoter(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteVoter(id);
        revalidatePath(`/admin/elections/edit/${params.id}`);
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Election</h1>
                    <p className="text-muted-foreground">{election.title}</p>
                </div>
                 <Button asChild>
                    <Link href={`/admin/candidates?electionId=${election.id}`}>
                        Manage Candidates
                    </Link>
                </Button>
            </div>
            
             <Tabs defaultValue="settings">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="voters">Voters</TabsTrigger>
                </TabsList>
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Election Settings</CardTitle>
                            <CardDescription>
                                Update the election timeframe, title, and description.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ElectionForm
                                action={handleUpdate}
                                election={election}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="voters">
                    <VoterManagement
                        voters={voters}
                        addVoterAction={handleAddVoter}
                        deleteVoterAction={handleDeleteVoter}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
