import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from 'lucide-react';

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Election Results</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Live results as votes are being tallied.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Presidential Race</CardTitle>
            <CardDescription>Total Votes: 1,234,567</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-md">
                <BarChart className="w-16 h-16 text-gray-400" />
                <p className="ml-4 text-gray-500">Chart placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vice Presidential Race</CardTitle>
            <CardDescription>Total Votes: 1,230,112</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-md">
                <BarChart className="w-16 h-16 text-gray-400" />
                <p className="ml-4 text-gray-500">Chart placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
