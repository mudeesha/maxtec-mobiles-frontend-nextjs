"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  fullscreen?: boolean
}

export function LoadingSpinner({ size = "md", fullscreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  const spinner = (
    <div className={cn("animate-spin rounded-full border-4 border-muted border-t-primary", sizeClasses[size])} />
  )

  if (fullscreen) {
    return <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">{spinner}</div>
  }

  return <div className="flex justify-center items-center">{spinner}</div>
}
