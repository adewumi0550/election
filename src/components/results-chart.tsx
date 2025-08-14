'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ResultsChartProps {
  data: {
    candidateName: string;
    votes: number;
  }[];
}

export default function ResultsChart({ data }: ResultsChartProps) {
  return (
    <ChartContainer
      config={{
        votes: {
          label: 'Votes',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="min-h-[200px] w-full"
    >
      <BarChart
        data={data}
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
  );
}
