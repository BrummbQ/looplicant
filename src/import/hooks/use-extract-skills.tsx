import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { parsePdfToDataUri } from "@/lib/parse-pdf-to-datauri";
import { handleExtractSkills, Skills } from "../lib/actions";

export function useExtractSkills() {
  const [skills, setSkills] = useState<Skills>();
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const { addToast } = useToast();

  function clearSkills() {
    setSkills(undefined);
  }

  async function extractSkills(values: {
    userProfile: string;
    userProfilePdf?: FileList;
  }) {
    setIsSkillsLoading(true);
    setSkills(undefined);

    let pdfDataUri: string | undefined;

    try {
      if (values.userProfilePdf?.[0]) {
        pdfDataUri = await parsePdfToDataUri(values.userProfilePdf[0]);
      }

      const inputForAction = {
        userProfile: values.userProfile,
        userProfilePdfDataUri: pdfDataUri,
      };

      const result = await handleExtractSkills(inputForAction);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.skills) {
        throw new Error("Empty skills");
      }

      setSkills(result.skills);
      addToast("Skills extracted successfully.", "success");
    } catch (error) {
      console.error("Skills Extraction Error:", error);
      addToast("Skills Extraction failed.", "error");
    } finally {
      setIsSkillsLoading(false);
    }
  }

  return {
    skills,
    isSkillsLoading,
    extractSkills,
    clearSkills,
  };
}
