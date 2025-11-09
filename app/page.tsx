"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Truck, Award } from "lucide-react"
import { products, getProductName, getDefaultImage, getAttributeValuesText } from "@/lib/mock-data"
import { useState } from "react"
import { ProductDetailsModal } from "@/components/products/product-details-modal"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cartRefresh, setCartRefresh] = useState(0)

  const featuredProducts = products.slice(0, 6)

  const handleProductClick = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCartUpdate = () => {
    setCartRefresh((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-0 px-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/premium-electronics-mobile-devices-tech-gadgets.jpg"
            alt="Hero banner - Premium electronics showcase"
            className="w-full h-full object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/40"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">Discover Premium Electronics & Gadgets</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Explore the latest cutting-edge technology from trusted brands. Fast delivery, secure checkout, and
              exceptional customer service.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Maxtec Mobiles?</h2>
            <p className="text-lg text-muted-foreground">
              We provide the best shopping experience with quality products and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and reliable shipping directly to your doorstep within 3-5 business days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment and personal information is always encrypted and protected.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">
                  30-day return policy with free returns on all eligible items. No questions asked.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  All products are authentic and sourced directly from official manufacturers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Check out our most popular electronics and gadgets</p>
          </div>

          {/* Smaller card grid for featured products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-md transition-all duration-300 hover:border-primary/30 cursor-pointer group"
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="pt-3 p-3">
                  <div className="aspect-square bg-secondary rounded-md mb-3 overflow-hidden flex items-center justify-center">
                    <img
                      src={getDefaultImage(product) || "/placeholder.svg"}
                      alt={getProductName(product)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{getProductName(product)}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{getAttributeValuesText(product)}</p>

                  {product.stockQuantity > 0 ? (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs mb-2">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 text-xs mb-2"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 py-2 px-3">
                  <p className="text-base font-bold text-primary">${product.price.toFixed(2)}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                    Quick View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent rounded-lg p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg mb-8 opacity-90">
            Browse our extensive collection of premium electronics and find exactly what you need.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Start Shopping Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <div className="flex-1"></div>
      <Footer />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
          product={selectedProduct}
          onCartUpdate={handleCartUpdate}
        />
      )}
    </div>
  )
}
