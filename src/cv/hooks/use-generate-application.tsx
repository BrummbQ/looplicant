import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { parsePdfToDataUri } from "@/lib/parse-pdf-to-datauri";
import { handleGenerateApplication } from "../lib/actions";

export function useGenerateApplication() {
  const [generatedApplication, setGeneratedApplication] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  async function generate(values: {
    userProfile: string;
    jobDescription: string;
    userProfilePdf?: FileList;
  }) {
    setIsLoading(true);
    setGeneratedApplication(undefined);

    let pdfDataUri: string | undefined;

    try {
      if (values.userProfilePdf?.[0]) {
        pdfDataUri = await parsePdfToDataUri(values.userProfilePdf[0]);
      }

      const inputForAction = {
        jobDescription: values.jobDescription,
        userProfile: values.userProfile,
        userProfilePdfDataUri: pdfDataUri,
      };

      const result = await handleGenerateApplication(inputForAction);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.applicationDraft) {
        throw new Error("Empty draft");
      }

      setGeneratedApplication(result.applicationDraft);
      addToast("Application generated successfully.", "success");
    } catch (error) {
      console.error("Generation Error:", error);
      addToast("Generation failed.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    generatedApplication,
    isLoading,
    generate,
  };
}
