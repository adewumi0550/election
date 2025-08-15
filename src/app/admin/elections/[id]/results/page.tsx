import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function ElectionResultsPage({ params }: { params: { id: string } }) {
  const results = {
    "President": [
      { name: "Ada Lovelace", votes: 1250 },
      { name: "Grace Hopper", votes: 980 },
    ],
    "Vice President": [
      { name: "Alan Turing", votes: 1500 },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <Link href={`/admin/elections/${params.id}`} className="flex items-center text-sm text-gray-500 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Election Details
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Election Results & Chart</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            {Object.entries(results).map(([office, candidates]) => (
                <Card key={office} className="mb-6">
                    <CardHeader>
                        <CardTitle>{office}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {candidates.map(candidate => (
                                <div key={candidate.name}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{candidate.name}</span>
                                        <span className="text-muted-foreground">{candidate.votes.toLocaleString()} Votes</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Chart Settings</CardTitle>
              <CardDescription>Configure how the results are displayed on the public page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="chart-type">Chart Type</Label>
                     <Select>
                        <SelectTrigger id="chart-type">
                            <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                            <SelectItem value="pie">Pie Chart</SelectItem>
                            <SelectItem value="live">Live Ticker</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select>
                        <SelectTrigger id="visibility">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="admin">Admin Only</SelectItem>
                            <SelectItem value="hidden">Hidden until election ends</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              <Button className="w-full">Save Chart Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
