"use client";

import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "gradient";
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  size = "md",
  variant = "default",
  className
}: ProgressBarProps) {

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  const variantClasses = {
    default: "[&>div]:bg-primary",
    success: "[&>div]:bg-green-500",
    gradient: "[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-purple-600"
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(value)}%</span>
        </div>
      )}
      <Progress
        value={value}
        className={cn(sizeClasses[size], variantClasses[variant])}
      />
    </div>
  );
}