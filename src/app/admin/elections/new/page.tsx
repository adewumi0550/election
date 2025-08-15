import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateElectionPage() {
  const levels = [100, 200, 300, 400, 500, 600, 700, 800];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="mb-8">
            <Link href="/admin/dashboard" className="flex items-center text-sm text-gray-500 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
            </Link>
        </div>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Election</CardTitle>
            <CardDescription>
              Set the title and timeframe for your new election. You can add candidates and voters after creation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="election-title">Election Title</Label>
                <Input id="election-title" placeholder="e.g., Presidential Election 2024" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date & Time</Label>
                  <Input id="start-date" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date & Time</Label>
                  <Input id="end-date" type="datetime-local" required />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Supported Levels</Label>
                <p className="text-sm text-muted-foreground">Select which academic levels are eligible for this election.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox id={`level-${level}`} />
                      <Label htmlFor={`level-${level}`} className="font-normal">{level} Level</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full" size="lg">Create Election</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
