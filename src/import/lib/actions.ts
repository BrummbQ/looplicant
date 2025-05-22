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
    if (!input.userProfile && !input.userProfilePdfDataUri) {
      return {
        error: "Either User Profile text or a PDF CV upload is required.",
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

export type Experience = ExtractExperienceOutput["experience"][0];

interface ExperienceActionResult {
  experience?: ExtractExperienceOutput["experience"];
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
    return { experience: result.experience };
  } catch (e: any) {
    console.error("Error extracting skills:", e);
    return { error: genkitErrorMessage(e) };
  }
}
