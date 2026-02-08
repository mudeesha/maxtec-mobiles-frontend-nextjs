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

  useEffect(() => {
    if (initialProduct && initialProduct.attributes.length > 0) {
      const attrs: Record<string, string> = {}
      initialProduct.attributes.forEach(attr => {
        attrs[attr.type] = attr.value
      })
      setSelectedAttributes(attrs)
      setCurrentProduct(initialProduct)
      setSelectedImageIndex(0)
    }
  }, [initialProduct])

  const findMatchingProduct = (attributes: Record<string, string>): ProductVariantDto | null => {
    for (const p of model.products) {
      const matches = p.attributes.every(attr => 
        attributes[attr.type] === attr.value
      )
      if (matches && p.attributes.length === Object.keys(attributes).length) {
        return p
      }
    }
    return null
  }

  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0) {
      const matchingProduct = findMatchingProduct(selectedAttributes)
      if (matchingProduct) {
        setCurrentProduct(matchingProduct)
      }
    }
  }, [selectedAttributes, model.products])

  if (!isOpen) return null

  const images = currentProduct.images && currentProduct.images.length > 0 
    ? currentProduct.images 
    : currentProduct.defaultImageUrl 
      ? [currentProduct.defaultImageUrl] 
      : model.defaultImageUrl 
        ? [model.defaultImageUrl] 
        : []

  const currentImage = images[selectedImageIndex] || "/placeholder.svg"

  const getAttributeOptions = (type: string): string[] => {
    return model.attributeOptions[type] || []
  }

  const handleAttributeSelect = (type: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const isOptionAvailable = (type: string, value: string): boolean => {
    const productsWithOption = model.products.filter(p => 
      p.attributes.some(attr => attr.type === type && attr.value === value)
    )
    return productsWithOption.some(p => p.stockQuantity > 0)
  }

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

      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-border">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-3 md:px-6 py-3 border-b border-border bg-card md:hidden sticky top-0 z-10">
          <h2 className="text-sm font-semibold truncate flex-1">{productName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 flex-shrink-0 hover:bg-secondary">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto flex-1 md:flex md:gap-6 md:p-6 p-3">
          {/* Left Column - Images */}
          <div className="md:w-80 flex-shrink-0 space-y-3">
            {/* Main Image - Fixed 400px height */}
            <div className="relative w-full bg-gradient-to-br from-secondary to-secondary/50 rounded-lg overflow-hidden border border-border/50">
              <div className="h-[420px] flex items-center justify-center">
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt={productName}
                  className="h-full w-full object-cover p-0"
                />
              </div>

              {currentProduct.stockQuantity === 0 && (
                <div className="absolute top-3 right-3 bg-destructive text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 h-16 w-16 rounded-md border overflow-hidden transition-all hover:border-primary/60 ${
                      selectedImageIndex === index
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxHeight: '100%',
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Features */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 text-accent" />
                <span>Free Shipping on Orders Over Rs. 5000</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5 text-accent" />
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="mt-4 md:mt-0 flex-1 space-y-4 flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:block space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{model.brandName}</p>
                  <h1 className="text-xl font-bold text-foreground">{model.name}</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">SKU: {currentProduct.sku}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-7 w-7 flex-shrink-0 hover:bg-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">(247 Reviews)</span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="space-y-2 pb-4 border-b border-border">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary">Rs. {currentProduct.price.toLocaleString()}</p>
                {model.minPrice !== model.maxPrice && (
                  <p className="text-xs text-muted-foreground">
                    (Range: Rs. {model.minPrice.toLocaleString()} - Rs. {model.maxPrice.toLocaleString()})
                  </p>
                )}
              </div>

              {currentProduct.stockQuantity > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-status-success"></div>
                  <span className="text-xs font-medium text-status-success">
                    In Stock ({currentProduct.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-status-danger"></div>
                  <span className="text-xs font-medium text-status-danger">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Attribute Selection */}
            <div className="space-y-3">
              {Object.entries(model.attributeOptions).map(([type, values]) => (
                <div key={type} className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-foreground">{type}</h3>
                  <div className="flex flex-wrap gap-1.5">
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
                          className={`text-xs h-7 px-2 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isAvailable}
                        >
                          {value}
                          {!isAvailable && (
                            <span className="text-xs ml-0.5">(Out of stock)</span>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Configuration */}
            <div className="bg-muted/50 rounded-md p-3 border border-border">
              <h3 className="text-xs font-semibold text-foreground mb-1.5">Selected Configuration</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{model.name}</span>
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

            {/* Quantity */}
            {currentProduct.stockQuantity > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Quantity</label>
                <div className="flex items-center gap-2 bg-secondary/30 border border-border rounded-md p-1.5 w-fit">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-6 w-6 p-0 hover:bg-secondary"
                  >
                    <Minus className="h-3 w-3" />
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
                    className="w-10 text-center border-0 bg-transparent text-xs font-medium p-0 h-5"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(currentProduct.stockQuantity, quantity + 1))}
                    className="h-6 w-6 p-0 hover:bg-secondary"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 mt-auto">
              <Button
                className="w-full h-10 bg-gradient-to-r from-primary to-accent hover:shadow-md text-sm font-semibold rounded-md"
                disabled={currentProduct.stockQuantity === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 border rounded-md text-sm font-semibold bg-transparent"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 mr-1.5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
                {isWishlisted ? "Saved" : "Save to Wishlist"}
              </Button>
            </div>

            {/* Description */}
            <div className="pt-4 pb-4 border-t border-border space-y-2">
              <h3 className="text-xs font-semibold text-foreground">About This Product</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Premium {productName} featuring {attributeText}. Designed for exceptional performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}