// 'use server';
/**
 * @fileOverview Generates a draft application based on a job description and user profile.
 *
 * - generateApplication - A function that handles the application generation process.
 * - GenerateApplicationInput - The input type for the generateApplication function.
 * - GenerateApplicationOutput - The return type for the generateApplication function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApplicationInputSchema = z.object({
  jobDescription: z.string().describe('The job description to generate the application for.'),
  userProfile: z.string().describe('The user profile information, including skills and experience.'),
});
export type GenerateApplicationInput = z.infer<typeof GenerateApplicationInputSchema>;

const GenerateApplicationOutputSchema = z.object({
  applicationDraft: z.string().describe('The generated application draft.'),
});
export type GenerateApplicationOutput = z.infer<typeof GenerateApplicationOutputSchema>;

export async function generateApplication(input: GenerateApplicationInput): Promise<GenerateApplicationOutput> {
  return generateApplicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateApplicationPrompt',
  input: {schema: GenerateApplicationInputSchema},
  output: {schema: GenerateApplicationOutputSchema},
  prompt: `You are an AI assistant that generates a draft application based on a job description and a user profile.

  Job Description: {{{jobDescription}}}

  User Profile: {{{userProfile}}}

  Please generate a draft application that highlights the relevant skills and experience from the user profile for the job description.`, 
});

const generateApplicationFlow = ai.defineFlow(
  {
    name: 'generateApplicationFlow',
    inputSchema: GenerateApplicationInputSchema,
    outputSchema: GenerateApplicationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
