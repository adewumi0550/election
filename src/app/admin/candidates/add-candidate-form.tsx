'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addCandidate } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Office, Election } from '@/lib/types';

const candidateSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  officeId: z.string().min(1, 'Office is required'),
  manifesto: z.string().min(10, 'Manifesto is required'),
  electionId: z.string().min(1, 'Election is required'),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface AddCandidateFormProps {
  offices: Office[];
  elections: Election[];
  selectedElectionId?: string;
}

export default function AddCandidateForm({ offices, elections, selectedElectionId }: AddCandidateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullName: '',
      officeId: '',
      manifesto: '',
      electionId: selectedElectionId || '',
    },
  });

  const handleAddCandidate = async (data: CandidateFormValues) => {
    try {
      await addCandidate({
        ...data,
        photoUrl: 'https://placehold.co/400x400.png',
        'data-ai-hint': 'person portrait',
      });
      toast({ title: 'Success', description: 'Candidate added successfully.' });
      // This is a client component, so we can't use revalidatePath directly.
      // We'll trigger a re-render by navigating.
      router.refresh();
      // A full refresh might be needed if revalidatePath isn't sufficient from the server action.
      // This ensures the list component gets the new data.
      window.location.href = `/admin/candidates?electionId=${data.electionId}`;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add candidate.' });
    }
  };
  
  const handleElectionChange = (electionId: string) => {
    router.push(`/admin/candidates?electionId=${electionId}`);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Candidate</CardTitle>
        <CardDescription>Fill out the form to add a new candidate.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleAddCandidate)} className="space-y-4">
          <div>
              <Label htmlFor="electionId">Election</Label>
              <Controller
                name="electionId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleElectionChange(value);
                  }} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an election" />
                    </SelectTrigger>
                    <SelectContent>
                      {elections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.electionId && <p className="text-sm text-destructive mt-1">{errors.electionId.message}</p>}
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Controller name="fullName" control={control} render={({ field }) => <Input {...field} />} />
            {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <Label htmlFor="officeId">Office</Label>
            <Controller
              name="officeId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an office" />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((office) => (
                      <SelectItem key={office.id} value={office.id}>
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.officeId && <p className="text-sm text-destructive mt-1">{errors.officeId.message}</p>}
          </div>

          <div>
            <Label htmlFor="manifesto">Manifesto</Label>
            <Controller name="manifesto" control={control} render={({ field }) => <Textarea {...field} />} />
            {errors.manifesto && <p className="text-sm text-destructive mt-1">{errors.manifesto.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Candidate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
