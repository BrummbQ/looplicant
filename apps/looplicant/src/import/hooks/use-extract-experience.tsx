import { use, useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { parsePdfToDataUri } from "@/lib/parse-pdf-to-datauri";
import {
  Experience,
  handleExtractExperience,
  handleSaveExperience,
} from "../lib/actions";

export function useExtractExperience() {
  const [isExtractingExperience, setIsExtractingExperience] = useState(false);
  const { addToast } = useToast();

  async function extractExperience(values: {
    userProfile: string;
    userProfilePdf?: FileList;
  }): Promise<undefined | Experience[]> {
    setIsExtractingExperience(true);

    let pdfDataUri: string | undefined;

    try {
      if (values.userProfilePdf?.[0]) {
        pdfDataUri = await parsePdfToDataUri(values.userProfilePdf[0]);
      }

      const inputForAction = {
        userProfile: values.userProfile,
        userProfilePdfDataUri: pdfDataUri,
      };

      const result = await handleExtractExperience(inputForAction);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.experience) {
        throw new Error("Empty Experience");
      }

      await handleSaveExperience(result.experience);
      addToast("Experience extracted successfully.", "success");
      return result.experience;
    } catch (error) {
      console.error("Experience Extraction Error:", error);
      addToast("Experience Extraction failed.", "error");
    } finally {
      setIsExtractingExperience(false);
    }
  }

  return {
    isExtractingExperience,
    extractExperience,
  };
}
