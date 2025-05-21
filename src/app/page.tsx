"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/Form";
import ApplicationLoader from "@/cv/ui/ApplicationLoader";
import GenerateApplicationButton from "@/cv/ui/GenerateApplicationButton";
import GeneratedApplication from "@/cv/ui/GeneratedApplication";
import JobInputCard from "@/cv/ui/JobInputCard";
import { useGenerateApplication } from "@/cv/hooks/use-generate-application";
import { CVFormSchemaType, cvFormSchema } from "@/cv/lib/form-schema";
import CvInputCard from "@/cv/ui/CvInputCard";

export default function LooplicantPage() {
  const form = useForm<CVFormSchemaType>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      userProfile: "",
      jobDescription: "",
      userProfilePdf: undefined,
    },
  });

  const { generate, generatedApplication, isLoading } =
    useGenerateApplication();

  async function onSubmit(values: CVFormSchemaType) {
    await generate({
      userProfile: values.userProfile ?? "",
      jobDescription: values.jobDescription,
      userProfilePdf: values.userProfilePdf,
    });
  }

  return (
    <main className="w-full max-w-4xl space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CvInputCard form={form} />
          <JobInputCard form={form} />
          <GenerateApplicationButton isLoading={isLoading} />
        </form>
      </Form>

      {isLoading ? (
        <ApplicationLoader />
      ) : (
        <GeneratedApplication generatedApplication={generatedApplication} />
      )}
    </main>
  );
}
