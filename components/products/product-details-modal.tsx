"use client"

import { useState, useEffect } from "react"
import { X, ShoppingCart, Heart, Plus, Minus, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { addToCart } from "@/lib/cart-store"

interface AttributeValueDto {
  id: number
  type: string
  value: string
}

interface ProductVariantDto {
  id: number
  sku: string
  attributes: AttributeValueDto[]
  stockQuantity: number
  price: number
  defaultImageUrl: string | null
  images: string[]
}

interface ModelListingDto {
  id: number
  name: string
  brandId: number
  brandName: string
  defaultImageUrl: string | null
  minPrice: number
  maxPrice: number
  totalStock: number
  hasStock: boolean
  attributeOptions: Record<string, string[]>
  products: ProductVariantDto[]
}

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductVariantDto
  model: ModelListingDto
  onCartUpdate?: () => void
}

export function ProductDetailsModal({ 
  isOpen, 
  onClose, 
  product: initialProduct, 
  model, 
  onCartUpdate 
}: ProductDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [currentProduct, setCurrentProduct] = useState<ProductVariantDto>(initialProduct)

  // Initialize selected attributes from the initial product
  useEffect(() => {
    if (initialProduct && initialProduct.attributes.length > 0) {
      const attrs: Record<string, string> = {}
      initialProduct.attributes.forEach(attr => {
        attrs[attr.type] = attr.value
      })
      setSelectedAttributes(attrs)
      setCurrentProduct(initialProduct)
      setSelectedImageIndex(0) // Reset to first image when product changes
    }
  }, [initialProduct])

  // Find matching product based on selected attributes
  const findMatchingProduct = (attributes: Record<string, string>): ProductVariantDto | null => {
    for (const p of model.products) {
      // Check if product has all selected attributes
      const matches = p.attributes.every(attr => 
        attributes[attr.type] === attr.value
      )
      
      // Also check if the product doesn't have extra attributes
      if (matches && p.attributes.length === Object.keys(attributes).length) {
        return p
      }
    }
    
    return null
  }

  // Update current product when selected attributes change
  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0) {
      const matchingProduct = findMatchingProduct(selectedAttributes)
      if (matchingProduct) {
        setCurrentProduct(matchingProduct)
      }
    }
  }, [selectedAttributes, model.products])

  if (!isOpen) return null

  // Get images for current product
  const images = currentProduct.images && currentProduct.images.length > 0 
    ? currentProduct.images 
    : currentProduct.defaultImageUrl 
      ? [currentProduct.defaultImageUrl] 
      : model.defaultImageUrl 
        ? [model.defaultImageUrl] 
        : []

  const currentImage = images[selectedImageIndex] || "/placeholder.svg"

  // Get available options for each attribute type
  const getAttributeOptions = (type: string): string[] => {
    return model.attributeOptions[type] || []
  }

  // Handle attribute selection
  const handleAttributeSelect = (type: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [type]: value
    }))
  }

  // Check if an option is available (has stock)
  const isOptionAvailable = (type: string, value: string): boolean => {
    // Find products with this attribute value
    const productsWithOption = model.products.filter(p => 
      p.attributes.some(attr => attr.type === type && attr.value === value)
    )
    
    // Check if any of those products are in stock
    return productsWithOption.some(p => p.stockQuantity > 0)
  }

  // Check if an option is currently selected
  const isOptionSelected = (type: string, value: string): boolean => {
    return selectedAttributes[type] === value
  }

  const handleAddToCart = () => {
    addToCart({
      productId: currentProduct.id,
      quantity,
      price: currentProduct.price,
      name: `${model.brandName} ${model.name}`,
      image: currentImage,
      attributes: currentProduct.attributes,
      sku: currentProduct.sku
    })
    setAddedToCart(true)
    onCartUpdate?.()
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const productName = `${model.brandName} ${model.name}`
  const attributeText = currentProduct.attributes
    .map(attr => `${attr.type}: ${attr.value}`)
    .join(", ")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--overlay)" }}
        onClick={onClose}
      />

      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-border">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card md:hidden sticky top-0 z-10">
          <h2 className="text-base font-semibold truncate flex-1">{productName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 flex-shrink-0 hover:bg-secondary">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto flex-1 md:flex md:gap-8 md:p-8 p-4">
          <div className="md:w-96 flex-shrink-0 space-y-4">
            {/* Main large image with premium frame effect */}
            <div className="relative w-full bg-gradient-to-br from-secondary to-secondary/50 rounded-xl overflow-hidden flex items-center justify-center min-h-96 border border-border/50 shadow-sm">
              <img
                src={currentImage || "/placeholder.svg"}
                alt={productName}
                className="w-full h-full object-contain p-4"
              />

              {currentProduct.stockQuantity === 0 && (
                <div className="absolute top-4 right-4 bg-destructive text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all hover:border-primary/70 ${
                      selectedImageIndex === index
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    title={`View image ${index + 1}`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-accent" />
                <span>Free Shipping on Orders Over Rs. 5000</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCcw className="h-4 w-4 text-accent" />
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex-1 space-y-6 flex flex-col">
            {/* Header - desktop only */}
            <div className="hidden md:block space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{model.brandName}</p>
                  <h1 className="text-2xl font-bold text-foreground">{productName}</h1>
                  <p className="text-sm text-muted-foreground mt-1">SKU: {currentProduct.sku}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 flex-shrink-0 hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(247 Reviews)</span>
              </div>
            </div>

            <div className="space-y-3 pb-6 border-b border-border">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-primary">Rs. {currentProduct.price.toLocaleString()}</p>
                {model.minPrice !== model.maxPrice && (
                  <p className="text-sm text-muted-foreground">
                    (Price range: Rs. {model.minPrice.toLocaleString()} - Rs. {model.maxPrice.toLocaleString()})
                  </p>
                )}
              </div>

              {currentProduct.stockQuantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-status-success"></div>
                  <span className="text-sm font-medium text-status-success">
                    In Stock ({currentProduct.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-status-danger"></div>
                  <span className="text-sm font-medium text-status-danger">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Attribute Selection */}
            <div className="space-y-4">
              {Object.entries(model.attributeOptions).map(([type, values]) => (
                <div key={type} className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{type}</h3>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value) => {
                      const isSelected = isOptionSelected(type, value)
                      const isAvailable = isOptionAvailable(type, value)
                      
                      return (
                        <Button
                          key={value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => isAvailable && handleAttributeSelect(type, value)}
                          className={`flex items-center gap-1 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isAvailable}
                        >
                          {value}
                          {!isAvailable && (
                            <span className="text-xs ml-1">(Out of stock)</span>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {currentProduct.stockQuantity > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Quantity</label>
                <div className="flex items-center gap-3 bg-secondary/30 border border-border rounded-lg p-3 w-fit">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={currentProduct.stockQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 1
                      setQuantity(Math.max(1, Math.min(value, currentProduct.stockQuantity)))
                    }}
                    className="w-16 text-center border-0 bg-transparent text-sm font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(currentProduct.stockQuantity, quantity + 1))}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Selected Configuration Summary */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">Selected Configuration</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{productName}</span>
                </div>
                {Object.entries(selectedAttributes).map(([type, value]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-muted-foreground">{type}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium text-primary">Rs. {currentProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">{currentProduct.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className={`font-medium ${currentProduct.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentProduct.stockQuantity > 0 ? `${currentProduct.stockQuantity} units` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 mt-auto">
              <Button
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all text-base font-semibold rounded-lg"
                disabled={currentProduct.stockQuantity === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-2 rounded-lg font-semibold bg-transparent"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
                {isWishlisted ? "Saved" : "Save to Wishlist"}
              </Button>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              <h3 className="font-semibold text-sm text-foreground">About This Product</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium {productName} featuring {attributeText}. Designed for
                professionals and enthusiasts alike, this product delivers exceptional performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}