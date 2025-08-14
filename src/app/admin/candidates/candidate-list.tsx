import { getCandidates, getOffices } from '@/lib/queries';
import { deleteCandidate } from '@/lib/actions';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const electionId = formData.get('electionId') as string;
    await deleteCandidate(id);
    revalidatePath(`/admin/candidates?electionId=${electionId}`);
}

export default async function CandidateList({ electionId }: { electionId?: string }) {
    if (!electionId) {
        return <p className="text-muted-foreground">Please select an election to view candidates.</p>;
    }
    const candidates = await getCandidates(electionId);
    const offices = await getOffices();

    if (candidates.length === 0) {
        return <p className="text-muted-foreground">No candidates found for this election.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>Actions</TableHead>
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
                        <TableCell className="space-x-2">
                             <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/candidates/edit/${candidate.id}`}>Edit</Link>
                            </Button>
                            <form action={handleDelete} className="inline">
                                <input type="hidden" name="id" value={candidate.id} />
                                <input type="hidden" name="electionId" value={electionId} />
                                <Button variant="destructive" size="sm" type="submit">Delete</Button>
                            </form>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
