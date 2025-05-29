
'use client';

import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-md ${className}`}>
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground mb-2 text-center">
          Step {currentStep} of {totalSteps}
        </p>
        <Progress value={progressPercentage} className="w-full h-2" />
      </div>
    </div>
  );
}
