import z from "zod";

export const BaseExperience = z.object({
  title: z.string().describe("The title or role of the experience."),
  company: z.string().describe("The company of the experience."),
  startDate: z.date().describe("The start date of the experience."),
  endDate: z.date().optional().describe("The end date of the experience."),
  description: z.string().describe("Short summary of the experience."),
  skills: z
    .array(z.string())
    .describe(
      "Keyword list of skills used in this experience. If there are different versions, like VueJS 1 and VueJS 2, just strip the version."
    ),
  location: z.string().optional().describe("Location of the experience."),
  bulletPoints: z
    .array(z.string())
    .optional()
    .describe("Bullet points of the experience unmodified"),
});

export const ExtractExperienceOutputSchema = z.object({
  experience: z
    .array(BaseExperience)
    .describe("A list of extracted experiences with detailed attributes."),
});

export type ExtractExperienceOutput = z.infer<
  typeof ExtractExperienceOutputSchema
>;

export type Experience = ExtractExperienceOutput["experience"][0] & {
  id: string;
};
