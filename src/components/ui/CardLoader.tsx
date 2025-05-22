import { Loader2, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { cn } from "@/lib/utils";

export default function CardLoader({
  loadingTitle,
  title,
  isLoading,
  children,
  icon: Icon,
}: {
  loadingTitle: string;
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
  icon: LucideIcon;
}) {
  return (
    <Card className={cn({ "animate-pulse": isLoading })}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <Loader2 className="h-7 w-7 text-muted-foreground" />
          ) : (
            <Icon className="h-7 w-7 text-primary" />
          )}
          <CardTitle className="text-muted-foreground">
            {isLoading ? loadingTitle : title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="h-5 bg-background rounded w-3/4"></div>
            <div className="h-5 bg-background rounded w-full"></div>
            <div className="h-5 bg-background rounded w-5/6"></div>
            <div className="h-5 bg-background rounded w-full"></div>
          </>
        ) : (
          <>{children}</>
        )}
      </CardContent>
    </Card>
  );
}
