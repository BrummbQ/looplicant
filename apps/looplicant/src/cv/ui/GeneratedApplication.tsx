import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/ToastContext";
import { FileCheck2, ClipboardCopy, FileDown } from "lucide-react";

export default function GeneratedApplication({
  generatedApplication,
}: {
  generatedApplication?: string;
}) {
  const { addToast } = useToast();

  const handleCopyToClipboard = () => {
    if (generatedApplication) {
      navigator.clipboard
        .writeText(generatedApplication)
        .then(() => {
          addToast("Application copied to clipboard.", "success");
        })
        .catch(() => {
          addToast("Failed to copy text.", "error");
        });
    }
  };

  const handleExportToPDF = () => {
    addToast(
      "PDF export functionality will be available in a future update.",
      "error"
    );
  };

  if (!generatedApplication) {
    return;
  }

  return (
    <Card>
      <CardHeader className="bg-card/50 border-b border-border/30">
        <div className="flex items-center space-x-3">
          <FileCheck2 className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl">
            Your AI-Generated Application
          </CardTitle>
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
        <Button
          onClick={handleCopyToClipboard}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ClipboardCopy className="mr-2 h-5 w-5" /> Copy to Clipboard
        </Button>
        <Button
          onClick={handleExportToPDF}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <FileDown className="mr-2 h-5 w-5" /> Export to PDF (Soon)
        </Button>
      </CardFooter>
    </Card>
  );
}
