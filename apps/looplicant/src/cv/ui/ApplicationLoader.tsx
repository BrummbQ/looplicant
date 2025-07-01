import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileCheck2 } from "lucide-react";

export default function ApplicationLoader() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="">
        <div className="flex items-center space-x-3">
          <FileCheck2 className="h-7 w-7 text-muted-foreground" />
          <CardTitle className="text-muted-foreground">
            Generating Application...
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="h-5 bg-muted rounded w-3/4"></div>
        <div className="h-5 bg-muted rounded w-full"></div>
        <div className="h-5 bg-muted rounded w-5/6"></div>
        <div className="h-5 bg-muted rounded w-full"></div>
      </CardContent>
    </Card>
  );
}
