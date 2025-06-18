import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import {
  Experience,
  handleExtractSkills,
  handleSaveSkills,
  Skills,
} from "../lib/actions";

export function useExtractSkills(resolvedSkills: Skills) {
  const [skills, setSkills] = useState<Skills | undefined>(resolvedSkills);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const { addToast } = useToast();

  function clearSkills() {
    setSkills(undefined);
  }

  async function extractSkills(experience: Experience[]) {
    setIsSkillsLoading(true);
    setSkills(undefined);

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
    clearSkills,
    extractSkills,
  };
}
