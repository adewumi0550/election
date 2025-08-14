import { addCandidate, getCandidates, getOffices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

export default async function CandidatesPage() {
    const offices = await getOffices();
    const candidates = await getCandidates();

    async function handleAddCandidate(formData: FormData) {
        'use server';

        const newCandidate = {
            fullName: formData.get('fullName') as string,
            officeId: formData.get('officeId') as string,
            manifesto: formData.get('manifesto') as string,
            photoUrl: 'https://placehold.co/400x400.png',
        };

        await addCandidate(newCandidate);
        revalidatePath('/admin/candidates');
        revalidatePath('/');
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Candidates</h1>
                <p className="text-muted-foreground">Add new candidates and view existing ones.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Candidate</CardTitle>
                            <CardDescription>Fill out the form to add a new candidate to the election.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handleAddCandidate} className="space-y-4">
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" name="fullName" required />
                                </div>
                                <div>
                                    <Label htmlFor="officeId">Office</Label>
                                    <Select name="officeId" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an office" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {offices.map(office => (
                                                <SelectItem key={office.id} value={office.id}>{office.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="manifesto">Manifesto</Label>
                                    <Textarea id="manifesto" name="manifesto" placeholder="Enter the candidate's manifesto..."/>
                                </div>
                                <Button type="submit" className="w-full">Add Candidate</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Candidates</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Photo</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Office</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {candidates.map(candidate => (
                                        <TableRow key={candidate.id}>
                                            <TableCell>
                                                <Image src={candidate.photoUrl} alt={candidate.fullName} width={40} height={40} className="rounded-full" data-ai-hint={candidate['data-ai-hint']}/>
                                            </TableCell>
                                            <TableCell>{candidate.fullName}</TableCell>
                                            <TableCell>{offices.find(o => o.id === candidate.officeId)?.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
