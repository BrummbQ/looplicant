"use client";

import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useExtractExperience } from "../hooks/use-extract-experience";
import { useExtractSkills } from "../hooks/use-extract-skills";
import { ImportFormSchemaType, importFormSchema } from "../lib/form-schema";
import ExperienceTimeline from "./ExperienceTimeline";
import ImportDataButton from "./ImportDataButton";
import PersonalInputCard from "./PersonalInputCard";
import SkillMap from "./SkillMap";
import { Form } from "@/components/ui/Form";

export default function ImportForm() {
  const form = useForm<ImportFormSchemaType>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      userProfile: "",
      userProfilePdf: undefined,
    },
  });

  const {
    extractExperience,
    experience,
    isExperienceLoading,
    clearExperience,
  } = useExtractExperience();
  const { skills, isSkillsLoading, clearSkills } = useExtractSkills(experience);

  function clearData() {
    clearSkills();
    clearExperience();
  }

  async function onSubmit(values: ImportFormSchemaType) {
    await extractExperience({
      userProfile: values.userProfile ?? "",
      userProfilePdf: values.userProfilePdf,
    });
  }

  return (
    <>
      {skills == null && experience == null && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInputCard form={form} />
            <ImportDataButton
              isLoading={isSkillsLoading || isExperienceLoading}
            />
          </form>
        </Form>
      )}

      {(skills || experience) && (
        <Button type="button" className="w-full" onClick={clearData}>
          <Wand2 className="mr-2 h-6 w-6" />
          Update Data
        </Button>
      )}
      <SkillMap
        skills={skills}
        experience={experience}
        isLoading={isSkillsLoading}
      />
      <ExperienceTimeline
        experience={experience}
        isLoading={isExperienceLoading}
      />
    </>
  );
}
