"use client";

import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useExtractExperience } from "../hooks/use-extract-experience";
import { useExtractSkills } from "../hooks/use-extract-skills";
import { ImportFormSchemaType, importFormSchema } from "../lib/form-schema";
import ImportDataButton from "./ImportDataButton";
import PersonalInputCard from "./PersonalInputCard";
import { Form } from "@/components/ui/Form";
import { useEffect, useRef, useState } from "react";
import { Experience } from "@lct/looplicant-types";

export default function ImportForm({ userId }: { userId: string }) {
  const [clearData, setClearData] = useState(false);
  const [experience, setExperience] = useState<Experience[]>();

  useEffect(() => {
    import("@lct/looplicant-ui/dist/lct-card.js");
  });

  const form = useForm<ImportFormSchemaType>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      userProfile: "",
      userProfilePdf: undefined,
    },
  });

  const { extractExperience, isExtractingExperience } = useExtractExperience();
  const { isExtractingSkills, extractSkills } = useExtractSkills();

  function updateData() {
    setClearData(true);
  }

  async function onSubmit(values: ImportFormSchemaType) {
    const experience = await extractExperience({
      userProfile: values.userProfile ?? "",
      userProfilePdf: values.userProfilePdf,
    });
    if (experience != null) {
      await extractSkills(experience);
    }
    setClearData(false);
  }

  const profileViewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = profileViewerRef.current;
    if (!el) return;

    const handler = (e: CustomEvent<Experience[]>) => {
      if (e.detail.length) {
        setExperience(e.detail);
      }
      setClearData(!e.detail.length);
    };

    el.addEventListener("dataloaded", handler as EventListener);

    return () => {
      el.removeEventListener("dataloaded", handler as EventListener);
    };
  }, []);

  return (
    <>
      {clearData && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInputCard form={form} />
            <ImportDataButton
              isLoading={isExtractingSkills || isExtractingExperience}
            />
          </form>
        </Form>
      )}
      {!clearData && experience?.length && (
        <Button type="button" className="w-full" onClick={updateData}>
          <Wand2 className="mr-2 h-6 w-6" />
          Update Data
        </Button>
      )}
      {!clearData && (
        <lct-profile-viewer
          ref={profileViewerRef}
          userId={userId}
        ></lct-profile-viewer>
      )}
    </>
  );
}
