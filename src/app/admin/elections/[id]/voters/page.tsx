import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Upload, Trash2, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ManageVotersPage({ params }: { params: { id: string } }) {
  const voters = [
    { id: "v1", matricNo: "12345", name: "Alice Smith", level: 100, voted: true },
    { id: "v2", matricNo: "67890", name: "Bob Johnson", level: 200, voted: false },
    { id: "v3", matricNo: "54321", name: "Charlie Brown", level: 100, voted: true },
  ];

  const levels = [100, 200, 300, 400, 500, 600, 700, 800];

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
              <CardTitle>Manage Voters</CardTitle>
              <CardDescription>List of eligible voters for this election.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matric No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Voted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voters.map((voter) => (
                    <TableRow key={voter.id}>
                      <TableCell className="font-medium">{voter.matricNo}</TableCell>
                      <TableCell>{voter.name}</TableCell>
                      <TableCell>{voter.level}</TableCell>
                      <TableCell>{voter.voted ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Add Single Voter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matric-no">Matric No.</Label>
                <Input id="matric-no" placeholder="e.g., 12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voter-name">Full Name</Label>
                <Input id="voter-name" placeholder="e.g., Alice Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={String(level)}>
                        {level} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Voter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Voters</CardTitle>
              <CardDescription>Upload a CSV file with voter details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Format: matric_no, full_name, level</p>
                <Button variant="link" size="sm" className="p-0 h-auto">
                    <Download className="mr-1 h-3 w-3" />
                    Download Template
                </Button>
              </div>
              <Input type="file" className="text-sm" />
              <Button className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload & Import
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
