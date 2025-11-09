"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <AlertCircle className="h-5 w-5" />,
  }

  const colorClasses: Record<ToastType, string> = {
    success: "bg-green-50 text-green-900 border-green-200",
    error: "bg-red-50 text-red-900 border-red-200",
    info: "bg-blue-50 text-blue-900 border-blue-200",
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 max-w-md p-4 rounded-lg border flex items-center gap-3 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4",
        colorClasses[type],
      )}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
