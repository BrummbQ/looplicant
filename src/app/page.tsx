
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Added Input for file
import { useToast } from "@/hooks/use-toast";
import { UserCircle2, Briefcase, Wand2, FileCheck2, FileDown, ClipboardCopy, Loader2, Bot, FileUp } from "lucide-react"; // Added FileUp

import { handleGenerateApplication } from "./actions";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formSchema = z.object({
  userProfile: z.string().max(15000, { message: "Profile/CV text must be at most 15000 characters."}).optional(),
  jobDescription: z.string().min(50, { message: "Job description must be at least 50 characters." }).max(15000, {message: "Job description must be at most 15000 characters."}),
  userProfilePdf: z.any().optional() // Changed from z.instanceof(FileList)
    .refine(files => {
      // Pass if no files are provided or if not in a browser environment with FileList
      if (!files || typeof FileList === 'undefined' || !(files instanceof FileList) || files.length === 0) return true;
      return files[0].size <= MAX_FILE_SIZE_BYTES;
    }, `Max file size is ${MAX_FILE_SIZE_MB}MB.`)
    .refine(files => {
      if (!files || typeof FileList === 'undefined' || !(files instanceof FileList) || files.length === 0) return true;
      return files[0].type === "application/pdf";
    }, "Only PDF files are allowed."),
}).superRefine((data, ctx) => {
  const pdfFileProvided = data.userProfilePdf && 
                          (typeof FileList !== 'undefined' && data.userProfilePdf instanceof FileList) && 
                          data.userProfilePdf.length > 0;

  if (!data.userProfile && !pdfFileProvided) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either Profile/CV text or a PDF upload is required.",
      path: ["userProfile"], 
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either Profile/CV text or a PDF upload is required.",
      path: ["userProfilePdf"],
    });
  }
  if (data.userProfile && data.userProfile.length > 0 && data.userProfile.length < 50 && !pdfFileProvided) {
     ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 50,
      type: "string",
      inclusive: true,
      message: "Profile/CV text must be at least 50 characters if no PDF is uploaded.",
      path: ["userProfile"],
    });
  }
});

export default function ResumeAIPage() {
  const [generatedApplication, setGeneratedApplication] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: "",
      jobDescription: "",
      userProfilePdf: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedApplication(null);

    let pdfDataUri: string | undefined = undefined;
    // Ensure values.userProfilePdf is a FileList and has files before processing
    if (values.userProfilePdf && typeof FileList !== 'undefined' && values.userProfilePdf instanceof FileList && values.userProfilePdf.length > 0) {
      const file = values.userProfilePdf[0];
      try {
        pdfDataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error("Error reading PDF file:", error);
        toast({ variant: "destructive", title: "File Read Error", description: "Could not read the PDF file. Please try again." });
        setIsLoading(false);
        return;
      }
    }

    try {
      const inputForAction = {
        jobDescription: values.jobDescription,
        userProfile: values.userProfile || "", 
        userProfilePdfDataUri: pdfDataUri,
      };
      const result = await handleGenerateApplication(inputForAction);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Generation Error",
          description: result.error,
          duration: 5000,
        });
      } else if (result.applicationDraft) {
        setGeneratedApplication(result.applicationDraft);
        toast({
          title: "Success!",
          description: "Application generated successfully.",
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Error",
          description: "Received an empty draft. Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedApplication) {
      navigator.clipboard.writeText(generatedApplication).then(() => {
        toast({ title: "Copied!", description: "Application copied to clipboard." });
      }).catch(() => {
        toast({ variant: "destructive", title: "Copy Error", description: "Failed to copy text." });
      });
    }
  };

  const handleExportToPDF = () => {
    toast({
      title: "Feature Coming Soon",
      description: "PDF export functionality will be available in a future update.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="my-8 text-center w-full max-w-4xl">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Bot size={48} className="text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">ResumeAI</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Craft compelling job applications powered by AI.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-xl border-border/60 overflow-hidden rounded-xl">
              <CardHeader className="bg-card/50 border-b border-border/30">
                <div className="flex items-center space-x-3">
                  <UserCircle2 className="h-7 w-7 text-primary" />
                  <CardTitle className="text-2xl">Your Profile / CV</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Paste your resume, a detailed summary, or upload your CV as a PDF.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
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
                          className="min-h-[200px] resize-y text-base border-input focus:ring-primary focus:border-primary"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              form.setValue('userProfilePdf', undefined, { shouldValidate: true });
                              setPdfFileName(null);
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
                      <FormLabel htmlFor="userProfilePdf" className="flex items-center gap-2">
                        <FileUp className="h-5 w-5 text-primary" /> Upload CV (PDF only, max {MAX_FILE_SIZE_MB}MB)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="userProfilePdf"
                          type="file"
                          accept="application/pdf"
                          className="border-input focus:ring-primary focus:border-primary"
                          onChange={(e) => {
                            const files = e.target.files;
                            rhfOnChange(files); // RHF expects FileList or undefined
                            if (files && files.length > 0) {
                              const file = files[0];
                              // Client-side pre-validation
                              if (file.size > MAX_FILE_SIZE_BYTES) {
                                form.setError("userProfilePdf", { type: "manual", message: `File is too large. Max ${MAX_FILE_SIZE_MB}MB.` });
                                setPdfFileName(null);
                                // Clear the input value if invalid
                                e.target.value = ''; 
                                rhfOnChange(undefined); // also update RHF state
                                return;
                              }
                              if (file.type !== "application/pdf") {
                                form.setError("userProfilePdf", { type: "manual", message: "Invalid file type. Only PDF is allowed." });
                                setPdfFileName(null);
                                e.target.value = '';
                                rhfOnChange(undefined);
                                return;
                              }
                              setPdfFileName(file.name);
                              form.setValue('userProfile', '', { shouldValidate: true }); 
                              form.clearErrors('userProfile');
                              form.clearErrors('userProfilePdf'); // Clear previous errors if now valid
                            } else {
                              setPdfFileName(null);
                               // If files become null/empty, trigger validation for the interrelated field userProfile
                              form.trigger('userProfile');
                            }
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                        />
                      </FormControl>
                       {pdfFileName && !form.formState.errors.userProfilePdf && (
                        <p className="text-sm text-muted-foreground mt-1">Selected: {pdfFileName}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-xl border-border/60 overflow-hidden rounded-xl">
              <CardHeader className="bg-card/50 border-b border-border/30">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-7 w-7 text-primary" />
                  <CardTitle className="text-2xl">Job Description</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Paste the complete job description for the role you're targeting.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="jobDescription" className="sr-only">Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="jobDescription"
                          placeholder="Paste the full job description here (min 50 characters)..."
                          className="min-h-[250px] resize-y text-base border-input focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full py-3 text-lg font-semibold hover:bg-primary/90 transition-colors duration-150" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-6 w-6" />
              )}
              Generate Application
            </Button>
          </form>
        </Form>

        {isLoading && (
          <Card className="shadow-xl border-border/60 overflow-hidden rounded-xl animate-pulse">
            <CardHeader className="bg-card/50 border-b border-border/30">
              <div className="flex items-center space-x-3">
                <FileCheck2 className="h-7 w-7 text-muted-foreground" />
                <CardTitle className="text-2xl text-muted-foreground">Generating Application...</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-5 bg-muted rounded w-full"></div>
              <div className="h-5 bg-muted rounded w-5/6"></div>
              <div className="h-5 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        )}

        {generatedApplication && !isLoading && (
          <Card className="shadow-xl border-border/60 overflow-hidden rounded-xl">
            <CardHeader className="bg-card/50 border-b border-border/30">
              <div className="flex items-center space-x-3">
                <FileCheck2 className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl">Your AI-Generated Application</CardTitle>
              </div>
              <CardDescription className="text-base">
                Review the draft below. You can copy it or (soon) export it as a PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={generatedApplication}
                readOnly
                className="min-h-[350px] bg-muted/20 resize-y text-base border-input"
                aria-label="Generated Application"
              />
            </CardContent>
            <CardFooter className="p-6 bg-card/50 border-t border-border/30 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button onClick={handleCopyToClipboard} variant="outline" className="w-full sm:w-auto">
                <ClipboardCopy className="mr-2 h-5 w-5" /> Copy to Clipboard
              </Button>
              <Button onClick={handleExportToPDF} variant="outline" className="w-full sm:w-auto">
                <FileDown className="mr-2 h-5 w-5" /> Export to PDF (Soon)
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <footer className="mt-16 mb-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ResumeAI. Powered by Next.js, Genkit, and Firebase.</p>
      </footer>
    </div>
  );
}

