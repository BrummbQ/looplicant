
"use server";

import { generateApplication, type GenerateApplicationInput } from "@/ai/flows/generate-application";

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
      return { error: "Either User Profile text or a PDF CV upload is required." };
    }

    const result = await generateApplication(input);
    if (!result.applicationDraft) {
        return { error: "AI failed to generate an application draft. The response was empty." };
    }
    return { applicationDraft: result.applicationDraft };
  } catch (e: any) {
    console.error("Error generating application:", e);
    
    let errorMessage = "Failed to generate application due to an unexpected error.";
    if (e instanceof Error) {
        // Check for common API key or configuration issues
        if (e.message.toLowerCase().includes("api key") || e.message.toLowerCase().includes("permission denied")) {
            errorMessage = "AI model configuration error. Please check your API key and permissions.";
        } else if (e.message.toLowerCase().includes("quota") || e.message.toLowerCase().includes("limit")) {
            errorMessage = "You have exceeded your AI usage quota. Please try again later.";
        } else {
            errorMessage = `An error occurred: ${e.message}`;
        }
    }
    // Specific check for Genkit errors if they have a known structure
    // else if (e.isGenkitError) { ... }

    return { error: errorMessage };
  }
}
