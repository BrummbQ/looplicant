import { Button } from "@/components/ui/Button";
import { Loader2, Wand2 } from "lucide-react";

export default function ImportDataButton({
  isLoading,
}: {
  isLoading: boolean;
}) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-6 w-6" />
      )}
      Import Data
    </Button>
  );
}
