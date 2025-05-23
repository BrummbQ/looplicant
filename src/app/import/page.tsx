"use client";

import {
  ImportFormSchemaType,
  importFormSchema,
} from "@/import/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/Form";
import PersonalInputCard from "@/import/ui/PersonalInputCard";
import ImportDataButton from "@/import/ui/ImportDataButton";
import SkillMap from "@/import/ui/SkillMap";
import { useExtractSkills } from "@/import/hooks/use-extract-skills";
import { Button } from "@/components/ui/Button";
import { Wand2 } from "lucide-react";
import { useExtractExperience } from "@/import/hooks/use-extract-experience";
import ExperienceTimeline from "@/import/ui/ExperienceTimeline";

export default function ImportPage() {
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
    <main className="w-full max-w-4xl space-y-8">
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
      <SkillMap skills={skills} isLoading={isSkillsLoading} />
      <ExperienceTimeline
        experience={experience}
        isLoading={isExperienceLoading}
      />
    </main>
  );
}
