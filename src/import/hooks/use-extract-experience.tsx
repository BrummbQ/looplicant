import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { parsePdfToDataUri } from "@/lib/parse-pdf-to-datauri";
import { Experience, handleExtractExperience } from "../lib/actions";

export function useExtractExperience() {
  const [experience, setExperience] = useState<Experience[]>();
  const [isExperienceLoading, setIsExperienceLoading] = useState(false);
  const { addToast } = useToast();

  function clearExperience() {
    setExperience(undefined);
  }

  async function extractExperience(values: {
    userProfile: string;
    userProfilePdf?: FileList;
  }) {
    setIsExperienceLoading(true);
    setExperience(undefined);

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

      setExperience(result.experience);
      addToast("Experience extracted successfully.", "success");
    } catch (error) {
      console.error("Experience Extraction Error:", error);
      addToast("Experience Extraction failed.", "error");
    } finally {
      setIsExperienceLoading(false);
    }
  }

  return {
    experience,
    isExperienceLoading,
    extractExperience,
    clearExperience,
  };
}
