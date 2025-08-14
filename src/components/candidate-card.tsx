import Image from 'next/image';
import type { Candidate } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CandidateCardProps {
  candidate: Candidate;
  officeId: string;
}

export default function CandidateCard({ candidate, officeId }: CandidateCardProps) {
  const cardId = `candidate-${candidate.id}`;
  return (
    <Label htmlFor={cardId}>
      <Card className="hover:border-primary transition-colors cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Image
            src={candidate.photoUrl}
            alt={candidate.fullName}
            width={80}
            height={80}
            className="rounded-full border"
            data-ai-hint={candidate['data-ai-hint']}
          />
          <div className="flex-1">
            <CardTitle>{candidate.fullName}</CardTitle>
          </div>
          <RadioGroupItem value={candidate.id} id={cardId} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            &quot;{candidate.manifesto}&quot;
          </p>
        </CardContent>
      </Card>
    </Label>
  );
}
