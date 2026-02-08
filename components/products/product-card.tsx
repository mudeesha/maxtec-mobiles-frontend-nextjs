// src/components/products/product-card.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { productService, type ModelListingDto } from "@/services/productService"
import { ShoppingBag } from "lucide-react"

interface ProductCardProps {
  model: ModelListingDto
  onModelClick: (model: ModelListingDto) => void
}

export function ProductCard({ model, onModelClick }: ProductCardProps) {
  const defaultProduct = productService.getDefaultProduct(model)
  const imageUrl = defaultProduct?.defaultImageUrl || model.defaultImageUrl || "/placeholder.svg"
  
  const formatPrice = (price: number) => {
    if (price >= 100000) return `Rs. ${(price / 1000).toFixed(0)}k`
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border border-border hover:border-primary transition-all duration-200 hover:shadow-md rounded-lg"
      onClick={() => onModelClick(model)}
    >
      {/* Image Section - Reduced padding */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/20 to-secondary/5 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${model.brandName} ${model.name}`}
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Brand & Stock Badges - Smaller */}
        <Badge variant="secondary" className="absolute top-2 left-2 text-[11px] font-medium px-1.5 py-0.5 bg-background/90">
          {model.brandName}
        </Badge>
        
        {model.hasStock ? (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-[11px] px-1.5 py-0.5">
            In Stock
          </Badge>
        ) : (
          <Badge variant="destructive" className="absolute top-2 right-2 text-[11px] px-1.5 py-0.5">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Content Section - Reduced padding and spacing */}
      <CardContent className="p-3 space-y-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary">
            {model.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {productService.getAttributeSummary(model)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-primary">
              {formatPrice(model.minPrice)}
            </span>
            {model.minPrice !== model.maxPrice && (
              <>
                <span className="text-[11px] text-muted-foreground">from</span>
                {model.maxPrice > model.minPrice * 1.2 && (
                  <span className="text-[11px] text-muted-foreground line-through">
                    {formatPrice(model.maxPrice)}
                  </span>
                )}
              </>
            )}
          </div>
          
          {model.products.length > 1 && (
            <p className="text-[11px] text-muted-foreground">
              {model.products.length} variants
            </p>
          )}
        </div>

        <Button
          size="sm"
          className="w-full gap-1.5 text-xs h-8"
          onClick={(e) => {
            e.stopPropagation()
            onModelClick(model)
          }}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}