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

export default function ImportPage() {
  const form = useForm<ImportFormSchemaType>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      userProfile: "",
      userProfilePdf: undefined,
    },
  });

  async function onSubmit(values: ImportFormSchemaType) {
    console.log("submit");
  }

  return (
    <main className="w-full max-w-4xl space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <PersonalInputCard form={form} />
          <ImportDataButton isLoading={false} />
        </form>
      </Form>
    </main>
  );
}
