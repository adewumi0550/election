import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function VotePage() {
  const offices = [
    {
      title: "President",
      candidates: [
        { id: "pres-ada", name: "Ada Lovelace" },
        { id: "pres-grace", name: "Grace Hopper" },
        { id: "pres-tim", name: "Tim Berners-Lee" },
      ],
    },
    {
      title: "Vice President",
      candidates: [
        { id: "vp-alan", name: "Alan Turing" },
        { id: "vp-margaret", name: "Margaret Hamilton" },
        { id: "vp-john", name: "John von Neumann" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Official Ballot</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Select one candidate for each office. Your vote is anonymous and secure.
        </p>
      </div>
      <div className="mx-auto max-w-3xl space-y-8 py-12">
        {offices.map((office) => (
          <Card key={office.title}>
            <CardHeader>
              <CardTitle>{office.title}</CardTitle>
              <CardDescription>Select one candidate to cast your vote.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup>
                {office.candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value={candidate.id} id={candidate.id} />
                    <Label htmlFor={candidate.id} className="text-lg font-medium cursor-pointer flex-1">{candidate.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
        <div className="text-center">
          <Button size="lg">Submit Your Vote</Button>
        </div>
      </div>
    </div>
  );
}
