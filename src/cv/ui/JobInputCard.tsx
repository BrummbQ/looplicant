import { Briefcase } from "lucide-react";

import { UseFormReturn } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";
import { CVFormSchemaType } from "../lib/form-schema";

export default function JobInputCard({
  form,
}: {
  form: UseFormReturn<Pick<CVFormSchemaType, "jobDescription">>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <Briefcase className="h-7 w-7 text-primary" />
          <CardTitle>Job Description</CardTitle>
        </div>
        <CardDescription>
          Paste the complete job description for the role you're targeting.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="jobDescription" className="sr-only">
                Job Description
              </FormLabel>
              <FormControl>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here (min 50 characters)..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
