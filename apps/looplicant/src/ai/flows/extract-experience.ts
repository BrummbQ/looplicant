"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import {
  ExtractExperienceOutput,
  ExtractExperienceOutputSchema,
} from "@lct/looplicant-types";

const ExtractExperienceInputSchema = z
  .object({
    userProfile: z
      .string()
      .optional()
      .describe(
        "The user profile information, including skills and experience (used if no PDF is provided)."
      ),
    userProfilePdfDataUri: z
      .string()
      .optional()
      .describe(
        "A PDF of the user's profile/CV, as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'. Used if provided, otherwise userProfile text is used."
      ),
  })
  .refine((data) => !!data.userProfile || !!data.userProfilePdfDataUri, {
    message:
      "Either userProfile text or userProfilePdfDataUri must be provided.",
  });

export type ExtractExperienceInput = z.infer<
  typeof ExtractExperienceInputSchema
>;

export async function extractExperience(
  input: ExtractExperienceInput
): Promise<ExtractExperienceOutput> {
  return ExtractExperienceFlow(input);
}

const prompt = ai.definePrompt({
  name: "ExtractExperiencePrompt",
  input: { schema: ExtractExperienceInputSchema },
  output: { schema: ExtractExperienceOutputSchema },
  prompt: `You are an AI assistant that extracts and summarizes experiences from a provided profile.

{{#if userProfilePdfDataUri}}
The user's profile/CV has been provided as a PDF document. Please extract the necessary information from the following document to understand their skills and experience:
User Profile PDF: {{media url=userProfilePdfDataUri}}
{{else}}
User Profile: {{{userProfile}}}
{{/if}}

Based on the information from the user's profile (either from the text input or extracted from the PDF), please extract all mentioned experiences that are usefull in a job.
`,
});

const ExtractExperienceFlow = ai.defineFlow(
  {
    name: "ExtractExperienceFlow",
    inputSchema: ExtractExperienceInputSchema,
    outputSchema: ExtractExperienceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
