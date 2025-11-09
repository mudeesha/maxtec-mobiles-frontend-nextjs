"use client"

import { useState } from "react"
import { X, ShoppingCart, Heart, Plus, Minus, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Product, getProductName, getBrandName, getAttributeValuesText, getDefaultImage } from "@/lib/mock-data"
import { addToCart } from "@/lib/cart-store"
import { Input } from "@/components/ui/input"

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onCartUpdate?: () => void
}

export function ProductDetailsModal({ isOpen, onClose, product, onCartUpdate }: ProductDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedColor, setSelectedColor] = useState("Red")
  const [selectedStorage, setSelectedStorage] = useState("128GB")

  if (!isOpen) return null

  const images = product.images.length > 0 ? product.images : []
  const currentImage = images[selectedImageIndex]?.imageUrl || getDefaultImage(product) || "/placeholder.svg"

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      price: product.price,
      name: getProductName(product),
      image: currentImage,
    })
    setAddedToCart(true)
    onCartUpdate?.()
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--overlay)" }}
        onClick={onClose}
      />

      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-border">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card md:hidden sticky top-0 z-10">
          <h2 className="text-base font-semibold truncate flex-1">{getProductName(product)}</h2>
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
                alt={getProductName(product)}
                className="w-full h-full object-contain p-4"
              />

              {product.stockQuantity === 0 && (
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
                      src={img.imageUrl || "/placeholder.svg"}
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
                <span>Free Shipping on Orders Over $50</span>
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
                  <p className="text-sm text-muted-foreground font-medium mb-1">{getBrandName(product)}</p>
                  <h1 className="text-2xl font-bold text-foreground">{getProductName(product)}</h1>
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
                <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <p className="text-lg text-muted-foreground line-through">${(product.price * 1.2).toFixed(2)}</p>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">-17%</Badge>
              </div>

              {product.stockQuantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-status-success"></div>
                  <span className="text-sm font-medium text-status-success">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-status-danger"></div>
                  <span className="text-sm font-medium text-status-danger">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Key Features</h3>
              <div className="space-y-2 text-sm">
                <p className="text-foreground">{getAttributeValuesText(product)}</p>
                <p className="text-muted-foreground">Premium quality with professional-grade specifications.</p>
              </div>
            </div>

            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Color</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Storage</label>
                    <select
                      value={selectedStorage}
                      onChange={(e) => setSelectedStorage(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {product.stockQuantity > 0 && (
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
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 1
                      setQuantity(Math.max(1, Math.min(value, product.stockQuantity)))
                    }}
                    className="w-16 text-center border-0 bg-transparent text-sm font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 mt-auto">
              <Button
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all text-base font-semibold rounded-lg"
                disabled={product.stockQuantity === 0}
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
                Premium {getProductName(product)} featuring {getAttributeValuesText(product)}. Designed for
                professionals and enthusiasts alike, this product delivers exceptional performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
