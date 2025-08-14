// Genkit is not configured as no Google AI plugin is available.
// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai';

// export const ai = genkit({
//   plugins: [googleAI()],
//   model: 'googleai/gemini-2.0-flash',
// });


// Stub 'ai' object to prevent application crash
export const ai = {
    defineFlow: (config: any, implementation: any) => implementation,
    definePrompt: (config: any) => (input: any) => Promise.resolve({ output: { manifesto: "AI is not configured." } }),
};
