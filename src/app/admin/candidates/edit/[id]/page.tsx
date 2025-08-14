import { getCandidate, getOffices, updateCandidate } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function EditCandidatePage({ params }: { params: { id: string } }) {
    const candidate = await getCandidate(params.id);
    const offices = await getOffices();

    if (!candidate) {
        notFound();
    }

    async function handleUpdateCandidate(formData: FormData) {
        'use server';

        const updatedData = {
            fullName: formData.get('fullName') as string,
            officeId: formData.get('officeId') as string,
            manifesto: formData.get('manifesto') as string,
            photoUrl: formData.get('photoUrl') as string,
        };

        await updateCandidate(params.id, updatedData);
        revalidatePath(`/admin/candidates`);
        revalidatePath(`/admin/candidates/edit/${params.id}`);
        redirect(`/admin/candidates?electionId=${candidate?.electionId}`);
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <Button asChild variant="outline">
                        <Link href={`/admin/candidates?electionId=${candidate.electionId}`}>
                            &larr; Back to Candidates
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Candidate: {candidate.fullName}</CardTitle>
                        <CardDescription>Update the details for this candidate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpdateCandidate} className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" defaultValue={candidate.fullName} required />
                            </div>
                            <div>
                                <Label htmlFor="officeId">Office</Label>
                                <Select name="officeId" defaultValue={candidate.officeId} required>
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
                                <Textarea id="manifesto" name="manifesto" defaultValue={candidate.manifesto} rows={5} />
                            </div>
                             <div>
                                <Label htmlFor="photoUrl">Photo URL</Label>
                                <Input id="photoUrl" name="photoUrl" defaultValue={candidate.photoUrl} />
                            </div>
                            <Button type="submit" className="w-full">Save Changes</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
