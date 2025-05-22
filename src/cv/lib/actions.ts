"use server";

import {
  generateApplication,
  type GenerateApplicationInput,
} from "@/ai/flows/generate-application";
import { genkitErrorMessage } from "@/lib/genkit-helper";

interface ActionResult {
  applicationDraft?: string;
  error?: string;
}

export async function handleGenerateApplication(
  input: GenerateApplicationInput // Updated type
): Promise<ActionResult> {
  try {
    // Validate input
    if (!input.jobDescription) {
      return { error: "Job description cannot be empty." };
    }
    if (!input.userProfile && !input.userProfilePdfDataUri) {
      return {
        error: "Either User Profile text or a PDF CV upload is required.",
      };
    }

    const result = await generateApplication(input);
    if (!result.applicationDraft) {
      return {
        error:
          "AI failed to generate an application draft. The response was empty.",
      };
    }
    return { applicationDraft: result.applicationDraft };
  } catch (e: any) {
    console.error("Error generating application:", e);
    return { error: genkitErrorMessage(e) };
  }
}
