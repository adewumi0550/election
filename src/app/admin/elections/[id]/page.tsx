import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Users, Vote, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function ElectionDetailsPage({ params }: { params: { id: string } }) {
  const election = {
    id: "1",
    title: "Presidential Election 2024",
    startDate: "2024-10-01",
    endDate: "2024-10-15",
    status: "Active"
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center text-sm text-gray-500 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{election.title}</h1>
          <p className="text-gray-500">
            {election.startDate} to {election.endDate}
          </p>
        </div>
        <Link href={`/admin/elections/edit/${election.id}`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Election
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href={`/admin/elections/${election.id}/candidates`}>
          <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Candidates</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add, edit, and remove candidates for this election.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/admin/elections/${election.id}/voters`}>
          <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Voters</CardTitle>
              <Vote className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage the list of eligible voters and import from a file.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/admin/elections/${election.id}/results`}>
          <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Results & Chart</CardTitle>
              <BarChart2 className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View live results and configure the voting chart display.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
