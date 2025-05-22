export function genkitErrorMessage(e: any): string {
  let errorMessage = "Failed to extract skills due to an unexpected error.";
  if (e instanceof Error) {
    // Check for common API key or configuration issues
    if (
      e.message.toLowerCase().includes("api key") ||
      e.message.toLowerCase().includes("permission denied")
    ) {
      errorMessage =
        "AI model configuration error. Please check your API key and permissions.";
    } else if (
      e.message.toLowerCase().includes("quota") ||
      e.message.toLowerCase().includes("limit")
    ) {
      errorMessage =
        "You have exceeded your AI usage quota. Please try again later.";
    } else {
      errorMessage = `An error occurred: ${e.message}`;
    }
  }
  // Specific check for Genkit errors if they have a known structure
  // else if (e.isGenkitError) { ... }
  return errorMessage;
}
