"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, X as CloseIcon } from "lucide-react"

interface ImagePreviewModalProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
}

export function ImagePreviewModal({ imageUrl, isOpen, onClose }: ImagePreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  if (!isOpen) return null

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        
        {/* Image container */}
        <div className="relative overflow-hidden rounded-lg bg-black">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg"
            }}
          />
        </div>
        
        {/* Zoom controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/70 text-white px-4 py-2 rounded-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {zoomLevel !== 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="h-8 px-3 text-white hover:bg-white/20 ml-2"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}