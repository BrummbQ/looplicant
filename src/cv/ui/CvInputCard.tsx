import { UserCircle2, FileUp } from "lucide-react";
import { useState } from "react";

import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import {
  CVFormSchemaType,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
} from "../lib/form-schema";

export default function CvInputCard({
  form,
}: {
  form: UseFormReturn<CVFormSchemaType>;
}) {
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <UserCircle2 className="h-7 w-7 text-primary" />
          <CardTitle>Your Profile / CV</CardTitle>
        </div>
        <CardDescription>
          Paste your resume, a detailed summary, or upload your CV as a PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="userProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="userProfile">Paste Profile/CV Text</FormLabel>
              <FormControl>
                <Textarea
                  id="userProfile"
                  placeholder="Paste your CV content or detailed profile here..."
                  className="min-h-[200px]"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value) {
                      form.setValue("userProfilePdf", undefined, {
                        shouldValidate: true,
                      });
                      setPdfFileName(null);
                      const fileInput = document.getElementById(
                        "userProfilePdf"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = ""; // Clear file input
                    }
                  }}
                  disabled={!!pdfFileName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-center my-2 text-sm text-muted-foreground">OR</div>

        <FormField
          control={form.control}
          name="userProfilePdf"
          render={({ field: { onChange: rhfOnChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel
                htmlFor="userProfilePdf"
                className="flex items-center gap-2"
              >
                <FileUp className="h-5 w-5 text-primary" /> Upload CV (PDF only,
                max {MAX_FILE_SIZE_MB}MB)
              </FormLabel>
              <FormControl>
                <Input
                  id="userProfilePdf"
                  type="file"
                  accept="application/pdf"
                  className="border-input focus:ring-primary focus:border-primary"
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  onChange={(e) => {
                    const files = e.target.files;
                    rhfOnChange(files);
                    if (files && files.length > 0) {
                      const file = files[0];
                      if (file.size > MAX_FILE_SIZE_BYTES) {
                        form.setError("userProfilePdf", {
                          type: "manual",
                          message: `File is too large. Max ${MAX_FILE_SIZE_MB}MB.`,
                        });
                        setPdfFileName(null);
                        e.target.value = "";
                        rhfOnChange(undefined);
                        return;
                      }
                      if (file.type !== "application/pdf") {
                        form.setError("userProfilePdf", {
                          type: "manual",
                          message: "Invalid file type. Only PDF is allowed.",
                        });
                        setPdfFileName(null);
                        e.target.value = "";
                        rhfOnChange(undefined);
                        return;
                      }
                      setPdfFileName(file.name);
                      form.setValue("userProfile", "", {
                        shouldValidate: true,
                      });
                      form.clearErrors("userProfile");
                      form.clearErrors("userProfilePdf");
                    } else {
                      setPdfFileName(null);
                      // If file input is cleared, trigger validation on userProfile to ensure one is provided
                      form.trigger("userProfile");
                    }
                  }}
                />
              </FormControl>
              {pdfFileName && !form.formState.errors.userProfilePdf && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {pdfFileName}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
