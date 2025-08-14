'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Election } from '@/lib/types';

interface ElectionFormProps {
  action: (data: any) => Promise<any>;
  election?: Election;
}

export default function ElectionForm({ action, election }: ElectionFormProps) {
  const [title, setTitle] = useState(election?.title || '');
  const [startTime, setStartTime] = useState<Date | undefined>(election ? new Date(election.startTime) : undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(election ? new Date(election.endTime) : undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime || !title) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill out all fields.',
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Start time must be before end time.',
      });
      return;
    }

    setIsLoading(true);
    try {
        const result = await action({ title, startTime, endTime });
        toast({
            title: 'Success!',
            description: `Election has been ${election ? 'updated' : 'created'}.`,
        });
        if (!election) {
             router.push(`/admin/elections/edit/${result.id}`);
        } else {
            router.refresh();
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to ${election ? 'update' : 'create'} election.`,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <Label htmlFor="title">Election Title</Label>
            <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Student Union General Election 2025"
                required
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                    'w-full justify-start text-left font-normal',
                    !startTime && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startTime ? format(startTime, 'PPP p') : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={startTime}
                    onSelect={setStartTime}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            </div>
            <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                    'w-full justify-start text-left font-normal',
                    !endTime && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endTime ? format(endTime, 'PPP p') : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={endTime}
                    onSelect={setEndTime}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            </div>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {election ? 'Save Changes' : 'Create Election'}
        </Button>
    </form>
  );
}
