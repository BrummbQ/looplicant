
'use server';
/**
 * @fileOverview Generates a draft application based on a job description and user profile.
 *
 * - generateApplication - A function that handles the application generation process.
 * - GenerateApplicationInput - The input type for the generateApplication function.
 * - GenerateApplicationOutput - The return type for the generateApplication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApplicationInputSchema = z.object({
  jobDescription: z.string().describe('The job description to generate the application for.'),
  userProfile: z.string().optional().describe('The user profile information, including skills and experience (used if no PDF is provided).'),
  userProfilePdfDataUri: z.string().optional().describe("A PDF of the user's profile/CV, as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'. Used if provided, otherwise userProfile text is used."),
}).refine(data => !!data.userProfile || !!data.userProfilePdfDataUri, {
  message: "Either userProfile text or userProfilePdfDataUri must be provided.",
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

{{#if userProfilePdfDataUri}}
The user's profile/CV has been provided as a PDF document. Please extract the necessary information from the following document to understand their skills and experience:
User Profile PDF: {{media url=userProfilePdfDataUri}}
{{else}}
User Profile: {{{userProfile}}}
{{/if}}

Based on the information from the job description and the user's profile (either from the text input or extracted from the PDF), please generate a compelling draft application. Ensure the draft highlights the most relevant skills and experience for the specified job.`,
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
