"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  footer?: ReactNode
}

export function Modal({ isOpen, onClose, title, children, size = "md", footer }: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--overlay)" }}
        onClick={onClose}
      />

      <div className={cn("relative bg-card rounded-xl shadow-2xl w-full border border-border", sizeClasses[size])}>
        {/* Header - reduced padding */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>

        {footer && <div className="flex gap-3 px-6 py-4 border-t border-border rounded-b-xl justify-end">{footer}</div>}
      </div>
    </div>
  )
}
