import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ManageCandidatesPage({ params }: { params: { id: string } }) {
  const candidates = [
    { id: "c1", name: "Ada Lovelace", office: "President", manifesto: "Focus on open-source governance." },
    { id: "c2", name: "Grace Hopper", office: "President", manifesto: "Innovation in computing education." },
    { id: "c3", name: "Alan Turing", office: "Vice President", manifesto: "Advocate for AI ethics and research." },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <Link href={`/admin/elections/${params.id}`} className="flex items-center text-sm text-gray-500 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Election Details
        </Link>
      </div>

      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Candidates</CardTitle>
              <CardDescription>View, edit, or remove candidates for this election.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.office}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Candidate</CardTitle>
              <CardDescription>Fill in the details to add a candidate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="candidate-name">Full Name</Label>
                <Input id="candidate-name" placeholder="e.g., Ada Lovelace" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="office">Office</Label>
                <Input id="office" placeholder="e.g., President" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manifesto">Manifesto</Label>
                <Textarea id="manifesto" placeholder="Key campaign points..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input id="photo" placeholder="https://placehold.co/400x400.png" />
              </div>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Candidate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}