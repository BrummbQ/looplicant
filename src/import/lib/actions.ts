"use server";

import {
  extractExperience,
  ExtractExperienceInput,
  ExtractExperienceOutput,
} from "@/ai/flows/extract-experience";
import {
  extractSkills,
  ExtractSkillsOutput,
  type ExtractSkillsInput,
} from "@/ai/flows/extract-skills";
import { genkitErrorMessage } from "@/lib/genkit-helper";

export type Skill = ExtractSkillsOutput["skills"][0];
export type Skills = ExtractSkillsOutput["skills"];

interface SkillsActionResult {
  skills?: Skills;
  error?: string;
}

export async function handleExtractSkills(
  input: ExtractSkillsInput // Updated type
): Promise<SkillsActionResult> {
  try {
    if (!input.experience?.length) {
      return {
        error: "No experiences provided. Please provide a list of experiences.",
      };
    }

    const result = await extractSkills(input);
    if (!result.skills) {
      return {
        error: "AI failed to extract skills. The response was empty.",
      };
    }
    return { skills: result.skills };
  } catch (e: any) {
    console.error("Error extracting skills:", e);
    return { error: genkitErrorMessage(e) };
  }
}

export type Experience = ExtractExperienceOutput["experience"][0] & {
  id: string;
};

interface ExperienceActionResult {
  experience?: Experience[];
  error?: string;
}

export async function handleExtractExperience(
  input: ExtractExperienceInput // Updated type
): Promise<ExperienceActionResult> {
  try {
    if (!input.userProfile && !input.userProfilePdfDataUri) {
      return {
        error: "Either User Profile text or a PDF CV upload is required.",
      };
    }

    const result = await extractExperience(input);
    if (!result.experience) {
      return {
        error: "AI failed to extract experience. The response was empty.",
      };
    }

    // assign uuid to each experience
    const experienceWithId = result.experience.map((exp) => ({
      ...exp,
      id: crypto.randomUUID(),
    }));

    return { experience: experienceWithId };
  } catch (e: any) {
    console.error("Error extracting skills:", e);
    return { error: genkitErrorMessage(e) };
  }
}
