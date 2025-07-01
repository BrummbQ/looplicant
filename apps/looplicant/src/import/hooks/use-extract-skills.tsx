import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { handleExtractSkills, handleSaveSkills } from "../lib/actions";
import { Experience } from "@lct/looplicant-types";

export function useExtractSkills() {
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);
  const { addToast } = useToast();

  async function extractSkills(experience: Experience[]) {
    setIsExtractingSkills(true);

    try {
      const inputForAction = {
        experience: experience,
      };

      const result = await handleExtractSkills(inputForAction);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.skills) {
        throw new Error("Empty skills");
      }

      await handleSaveSkills(result.skills);

      addToast("Skills extracted successfully.", "success");
    } catch (error) {
      console.error("Skills Extraction Error:", error);
      addToast("Skills Extraction failed.", "error");
    } finally {
      setIsExtractingSkills(false);
    }
  }

  return {
    isExtractingSkills,
    extractSkills,
  };
}
