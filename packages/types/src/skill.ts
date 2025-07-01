import z from "zod";

export const ExtractSkillsOutputSchema = z.object({
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
          .describe(
            "Explanation or context for the skill in which it was used and how extensive."
          ),
        sources: z
          .array(
            z.object({
              experienceId: z.string().describe("The id of the experience"),
            })
          )
          .describe("List of experiences the skill was extracted from."),
      })
    )
    .describe("A list of extracted skills with detailed attributes."),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export type Skill = ExtractSkillsOutput["skills"][0];
export type Skills = ExtractSkillsOutput["skills"];
