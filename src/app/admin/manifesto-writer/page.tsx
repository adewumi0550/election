import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ManifestoWriterPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AI Manifesto Writer</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Generate a compelling manifesto for your campaign with the help of AI.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manifesto Details</CardTitle>
            <CardDescription>Provide some key details and let the AI do the rest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Candidate Name</Label>
              <Input id="candidate-name" placeholder="e.g., Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="office">Office</Label>
              <Input id="office" placeholder="e.g., President" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key-points">Key Campaign Points (comma-separated)</Label>
              <Textarea id="key-points" placeholder="e.g., Universal basic computing, Open-source governance, AI ethics..." />
            </div>
            <Button className="w-full">Generate Manifesto</Button>
          </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Generated Manifesto</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800 min-h-[200px]">
                    <p className="text-gray-500">Your generated manifesto will appear here...</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
