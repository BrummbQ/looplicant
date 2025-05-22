"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ExtractSkillsInputSchema = z
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

export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;
const ExtractSkillsOutputSchema = z.object({
  skills: z
    .array(
      z.object({
        title: z.string().describe("The name of the skill."),
        category: z
          .string()
          .describe(
            "The category of the skill. Try to find categories matching the profile."
          ),
        level: z
          .number()
          .min(0)
          .max(100)
          .describe("The proficiency level (0–100)."),
        description: z
          .string()
          .optional()
          .describe("Optional explanation or context for the skill."),
      })
    )
    .describe("A list of extracted skills with detailed attributes."),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(
  input: ExtractSkillsInput
): Promise<ExtractSkillsOutput> {
  return ExtractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: "ExtractSkillsPrompt",
  input: { schema: ExtractSkillsInputSchema },
  output: { schema: ExtractSkillsOutputSchema },
  prompt: `You are an AI assistant that extracts and summarizes skills from a provided profile.

{{#if userProfilePdfDataUri}}
The user's profile/CV has been provided as a PDF document. Please extract the necessary information from the following document to understand their skills and experience:
User Profile PDF: {{media url=userProfilePdfDataUri}}
{{else}}
User Profile: {{{userProfile}}}
{{/if}}

Based on the information from the user's profile (either from the text input or extracted from the PDF), please extract all mentioned skills that are usefull in a job. Try to consolidate similar skills and increase the level if they are mentioned often.
Try to find a good set of categories for each profile, that balances the skills fairly.`,
});

const ExtractSkillsFlow = ai.defineFlow(
  {
    name: "ExtractSkillsFlow",
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
