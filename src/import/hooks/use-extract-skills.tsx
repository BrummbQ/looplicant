import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { Experience, handleExtractSkills, Skills } from "../lib/actions";

export function useExtractSkills(experience?: Experience[]) {
  const [skills, setSkills] = useState<Skills>();
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const { addToast } = useToast();

  function clearSkills() {
    setSkills(undefined);
  }

  useEffect(() => {
    if (!experience) {
      return;
    }
    let isCancelled = false;

    const run = async (values: { experience: Experience[] }) => {
      setIsSkillsLoading(true);
      setSkills(undefined);

      try {
        const inputForAction = {
          experience: values.experience,
        };

        console.log("Extracting skills with input:", inputForAction);
        const result = await handleExtractSkills(inputForAction);
        console.log("got result:", result);

        if (isCancelled) {
          return;
        }

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
    };

    run({ experience }).then();

    return () => {
      isCancelled = true;
    };
  }, [experience]);

  return {
    skills,
    isSkillsLoading,
    clearSkills,
  };
}
