import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  const candidates = [
    { name: "Ada Lovelace", office: "President", votes: 543210 },
    { name: "Grace Hopper", office: "President", votes: 456789 },
    { name: "Alan Turing", office: "Vice President", votes: 654321 },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage candidates and monitor election progress.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Election Overview</CardTitle>
            <CardDescription>Summary of the current election status.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500">Total Votes</h3>
              <p className="text-3xl font-bold">1,234,567</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500">Candidates</h3>
              <p className="text-3xl font-bold">6</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500">Time Remaining</h3>
              <p className="text-3xl font-bold">2d 10h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
            <CardDescription>List of all registered candidates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.name}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.office}</TableCell>
                    <TableCell className="text-right">{candidate.votes.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}