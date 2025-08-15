import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const candidates = [
  { id: '1', name: 'John Doe', manifesto: 'A vote for me is a vote for progress and innovation.', photoUrl: 'https://placehold.co/100x100.png', 'data-ai-hint': 'person portrait' },
  { id: '2', name: 'Jane Smith', manifesto: 'I promise to bring transparency and accountability to the office.', photoUrl: 'https://placehold.co/100x100.png', 'data-ai-hint': 'person portrait' },
];

const offices = [
  { id: 'president', name: 'President' },
  { id: 'vice-president', name: 'Vice President' },
];

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Student Union Election</h1>
        <p className="text-muted-foreground mt-2">Cast your vote and make your voice heard.</p>
      </header>

      <div className="space-y-8">
        {offices.map((office) => (
           <Card key={office.id}>
             <CardHeader>
                <CardTitle>{office.name}</CardTitle>
             </CardHeader>
             <CardContent>
                <RadioGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((candidate) => (
                      <Label htmlFor={`candidate-${candidate.id}-${office.id}`} key={candidate.id}>
                        <Card className="hover:border-primary transition-colors cursor-pointer has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <Image
                              src={candidate.photoUrl}
                              alt={candidate.name}
                              width={80}
                              height={80}
                              className="rounded-full border"
                              data-ai-hint={candidate['data-ai-hint']}
                            />
                            <div className="flex-1">
                              <CardTitle>{candidate.name}</CardTitle>
                            </div>
                            <RadioGroupItem value={candidate.id} id={`candidate-${candidate.id}-${office.id}`} />
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground italic">
                              &quot;{candidate.manifesto}&quot;
                            </p>
                          </CardContent>
                        </Card>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
             </CardContent>
           </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button size="lg">Submit Your Vote</Button>
      </div>
    </div>
  );
}
