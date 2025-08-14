'use server';

/**
 * @fileOverview AI tool to help candidates write manifestos.
 *
 * - manifestoWriter - A function that generates a manifesto for a candidate.
 * - ManifestoWriterInput - The input type for the manifestoWriter function.
 * - ManifestoWriterOutput - The return type for the manifestoWriter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ManifestoWriterInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate.'),
  office: z.string().describe('The office the candidate is running for.'),
});
export type ManifestoWriterInput = z.infer<typeof ManifestoWriterInputSchema>;

const ManifestoWriterOutputSchema = z.object({
  manifesto: z.string().describe('The generated manifesto for the candidate.'),
});
export type ManifestoWriterOutput = z.infer<typeof ManifestoWriterOutputSchema>;

export async function manifestoWriter(input: ManifestoWriterInput): Promise<ManifestoWriterOutput> {
  return manifestoWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manifestoWriterPrompt',
  input: {schema: ManifestoWriterInputSchema},
  output: {schema: ManifestoWriterOutputSchema},
  prompt: `You are a campaign manager helping candidates write their manifestos.

  Write a compelling manifesto for the candidate {{candidateName}} who is running for the office of {{office}}.
  The manifesto should be clear, concise, and persuasive, outlining the candidate's vision and goals.
  The manifesto should be no more than 200 words.
  `,
});

const manifestoWriterFlow = ai.defineFlow(
  {
    name: 'manifestoWriterFlow',
    inputSchema: ManifestoWriterInputSchema,
    outputSchema: ManifestoWriterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
