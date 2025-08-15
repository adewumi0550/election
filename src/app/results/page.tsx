import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const resultsData = {
  president: {
    officeName: 'President',
    results: [
      { candidateName: 'John Doe', votes: 1200 },
      { candidateName: 'Jane Smith', votes: 950 },
    ],
  },
  'vice-president': {
    officeName: 'Vice President',
    results: [
      { candidateName: 'Alice Johnson', votes: 1100 },
      { candidateName: 'Bob Williams', votes: 1050 },
    ],
  },
};

export default function ResultsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Election Results</h1>
        <p className="text-muted-foreground mt-2">Here are the latest voting results.</p>
      </header>
      
      <div className="space-y-8">
        {Object.values(resultsData).map((officeResult) => (
          <Card key={officeResult.officeName}>
            <CardHeader>
              <CardTitle>{officeResult.officeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ votes: { label: 'Votes', color: 'hsl(var(--chart-1))' } }}
                className="min-h-[200px] w-full"
              >
                <BarChart
                  data={officeResult.results}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="candidateName"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={120}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <XAxis dataKey="votes" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="votes" fill="hsl(var(--primary))" radius={4}>
                    <LabelList dataKey="votes" position="right" offset={8} className="fill-foreground" fontSize={12} />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
