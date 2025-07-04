"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import {
  BaseExperience,
  ExtractSkillsOutput,
  ExtractSkillsOutputSchema,
} from "@lct/looplicant-types";

const ExtractSkillsInputSchema = z.object({
  experience: z.array(
    BaseExperience.extend({
      id: z
        .string()
        .uuid()
        .describe("The unique identifier of the experience."),
    }).describe("A list of experiences with detailed attributes.")
  ),
});

export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

export async function extractSkills(
  input: ExtractSkillsInput
): Promise<ExtractSkillsOutput> {
  return ExtractSkillsFlow(input);
}

function formatExperienceList({ experience }: ExtractSkillsInput): string {
  return experience
    .map((exp) => {
      const start = exp.startDate;
      const end = exp.endDate;
      const location = exp.location ? ` (${exp.location})` : "";
      const skillList = exp.skills.length
        ? `Skills: ${exp.skills.join(", ")}`
        : "";

      const bullets = exp.bulletPoints?.length
        ? exp.bulletPoints.map((b) => `- ${b}`).join("\n")
        : "";

      return `
## Experience (id: ${exp.id}): ${exp.title} at ${exp.company}${location}
Duration: ${start} - ${end}

${exp.description}

${skillList}

${bullets}
      `.trim();
    })
    .join("\n\n---\n\n");
}

const prompt = ai.definePrompt({
  name: "ExtractSkillsPrompt",
  input: { schema: z.object({ experience: z.string() }) },
  output: { schema: ExtractSkillsOutputSchema },
  prompt: `You are an AI assistant that extracts and summarizes skills from a provided experience list.

Here is the user's experience list:

{{{experience}}}

Each experience is separated by "---" and includes a list of skills. Collect those skills and filter duplicates.
If the skill is not mentioned in the experience, please do not include it. Each skill should be referenced by the experience id. Use the exact skill names as found in the experience.
Try to find a maximum of 5 categories for the skills. If you find more, just pick the most relevant ones.
`,
});

const ExtractSkillsFlow = ai.defineFlow(
  {
    name: "ExtractSkillsFlow",
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    const formattedExperience = formatExperienceList(input);
    const { output } = await prompt({ experience: formattedExperience });
    return output!;
  }
);
