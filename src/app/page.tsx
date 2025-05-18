"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserCircle2, Briefcase, Wand2, FileCheck2, FileDown, ClipboardCopy, Loader2, Bot } from "lucide-react";

import { handleGenerateApplication } from "./actions";

const formSchema = z.object({
  userProfile: z.string().min(50, { message: "Profile/CV must be at least 50 characters." }).max(15000, {message: "Profile/CV must be at most 15000 characters."}),
  jobDescription: z.string().min(50, { message: "Job description must be at least 50 characters." }).max(15000, {message: "Job description must be at most 15000 characters."}),
});

export default function ResumeAIPage() {
  const [generatedApplication, setGeneratedApplication] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: "",
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedApplication(null);
    try {
      const result = await handleGenerateApplication(values);
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
    // Placeholder for PDF export logic:
    // For example, using jsPDF:
    // if (generatedApplication) {
    //   import('jspdf').then(jsPDFModule => {
    //     const doc = new jsPDFModule.default();
    //     // Basic text wrapping and page handling would be needed for long text
    //     const lines = doc.splitTextToSize(generatedApplication, 180); // 180 is approx width in mm for A4
    //     doc.text(lines, 10, 10);
    //     doc.save("application.pdf");
    //   }).catch(err => {
    //      toast({ variant: "destructive", title: "PDF Export Error", description: "Could not load PDF library." });
    //   });
    // }
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
                  Paste your resume or a detailed summary of your skills and experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="userProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="userProfile" className="sr-only">Your Profile / CV</FormLabel>
                      <FormControl>
                        <Textarea
                          id="userProfile"
                          placeholder="Paste your CV content or detailed profile here (min 50 characters)..."
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
