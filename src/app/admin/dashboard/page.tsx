import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Vote, Calendar, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const elections = [
    { id: "1", title: "Presidential Election 2024", startDate: "2024-10-01", endDate: "2024-10-15", status: "Active" },
    { id: "2", title: "Student Union Election", startDate: "2024-09-05", endDate: "2024-09-06", status: "Completed" },
    { id: "3", title: "Board of Directors Vote", startDate: "2025-01-10", endDate: "2025-01-20", status: "Upcoming" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage elections, candidates, and voters.</p>
        </div>
        <Link href="/admin/elections/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Election
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently open for voting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all elections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,432</div>
            <p className="text-xs text-muted-foreground">Registered to vote</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Elections</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">View archived results</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Election Overview</CardTitle>
          <CardDescription>List of all created elections and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.map((election) => (
                <TableRow key={election.id}>
                  <TableCell className="font-medium">{election.title}</TableCell>
                  <TableCell>{election.startDate}</TableCell>
                  <TableCell>{election.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={election.status === 'Active' ? 'default' : election.status === 'Completed' ? 'secondary' : 'outline'}>
                        {election.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/elections/${election.id}`}>
                        <Button variant="outline" size="sm">Manage</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
