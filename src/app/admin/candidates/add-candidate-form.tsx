'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addCandidate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import type { Office, Election } from '@/lib/types';
import { useState } from 'react';
import Image from 'next/image';

const candidateSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  officeId: z.string().min(1, 'Office is required'),
  manifesto: z.string().min(10, 'Manifesto is required'),
  electionId: z.string().min(1, 'Election is required'),
  photo: z.any().refine((files) => files?.length === 1, 'Image is required.'),
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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullName: '',
      officeId: '',
      manifesto: '',
      electionId: selectedElectionId || '',
      photo: undefined,
    },
  });

  const photoField = watch('photo');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPhotoPreview(null);
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleAddCandidate = async (data: CandidateFormValues) => {
    try {
      // Photo upload is disabled as Firebase Storage is not configured.
      // const photoBase64 = await toBase64(data.photo[0]);
      await addCandidate({
        fullName: data.fullName,
        officeId: data.officeId,
        manifesto: data.manifesto,
        electionId: data.electionId,
        photoUrl: "https://placehold.co/100x100.png", // Using a placeholder
        'data-ai-hint': 'person portrait',
      });
      toast({ title: 'Success', description: 'Candidate added successfully (using placeholder image).' });
      router.refresh();
      // A full page reload might be better here to ensure all state is reset.
      window.location.href = `/admin/candidates?electionId=${data.electionId}`;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add candidate. Firebase might not be configured.' });
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
            <Label htmlFor="photo">Candidate Photo</Label>
            <Controller
              name="photo"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <>
                  <Input 
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...rest}
                    onChange={(e) => {
                        onChange(e.target.files);
                        handlePhotoChange(e);
                    }}
                  />
                  <Label htmlFor="photo" className="cursor-pointer">
                      <div className="mt-1 flex justify-center items-center w-full h-32 px-6 border-2 border-dashed rounded-md">
                          {photoPreview ? (
                                <Image src={photoPreview} alt="Candidate preview" width={100} height={100} className="object-cover rounded-full h-28 w-28" />
                          ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mt-2">Click to upload image</p>
                                </div>
                          )}
                      </div>
                  </Label>
                </>
              )}
            />
            {errors.photo && <p className="text-sm text-destructive mt-1">{errors.photo.message?.toString()}</p>}
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
