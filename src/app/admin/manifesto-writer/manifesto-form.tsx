'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { manifestoWriter } from '@/ai/flows/manifesto-writer';
import type { Office } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  candidateName: z.string().min(2, { message: 'Candidate name is required.' }),
  office: z.string().min(1, { message: 'Office is required.' }),
});

export default function ManifestoForm({ offices }: { offices: Office[] }) {
  const [manifesto, setManifesto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: '',
      office: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setManifesto('');
    try {
      const result = await manifestoWriter(values);
      setManifesto(result.manifesto);
    } catch (error) {
      console.error('Failed to generate manifesto:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an error generating the manifesto. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(manifesto);
    toast({
        title: "Copied to clipboard!",
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Candidate Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="office"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Office</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an office" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {offices.map(office => (
                            <SelectItem key={office.id} value={office.name}>{office.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Manifesto
            </Button>
          </form>
        </Form>
        
        {(isLoading || manifesto) && (
            <div className="mt-6">
                <Label htmlFor="manifesto-output">Generated Manifesto</Label>
                <Textarea
                    id="manifesto-output"
                    readOnly
                    value={isLoading ? 'Generating... please wait.' : manifesto}
                    className="mt-2 min-h-[150px] bg-muted"
                />
                {!isLoading && manifesto && (
                    <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="mt-2">
                        Copy to Clipboard
                    </Button>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
