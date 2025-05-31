import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { HTMLAttributes } from "react";

const variants = {
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
    iconColor: "text-blue-500",
  },
  error: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-900",
    iconColor: "text-red-500",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-900",
    iconColor: "text-green-500",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-900",
    iconColor: "text-yellow-500",
  },
};

export type AlertVariant = keyof typeof variants;

interface AlertBoxProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: AlertVariant;
}

export function AlertBox({
  message,
  variant = "info",
  className,
}: AlertBoxProps) {
  const { icon: Icon, bg, border, text, iconColor } = variants[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed",
        bg,
        border,
        text,
        className
      )}
    >
      <Icon className={`h-6 w-6 ${iconColor}`} />
      <div className="text-sm leading-relaxed">{message}</div>
    </div>
  );
}
