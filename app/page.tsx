"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Truck, Award } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"
import { ProductDetailsModal } from "@/components/products/product-details-modal"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { productService, type ModelListingDto, type ProductVariantDto } from "@/services/productService"

export default function HomePage() {
  const [products, setProducts] = useState<ModelListingDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<ModelListingDto | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductVariantDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cartRefresh, setCartRefresh] = useState(0)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const allModels = await productService.fetchModels()
      
      const featuredProducts = allModels
        .filter(model => model.hasStock)
        .sort((a, b) => a.minPrice - b.minPrice)
        .slice(0, 8)
      
      setProducts(featuredProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleModelClick = (model: ModelListingDto) => {
    const defaultProduct = productService.getDefaultProduct(model)
    if (defaultProduct) {
      setSelectedModel(model)
      setSelectedProduct(defaultProduct)
      setIsModalOpen(true)
    }
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

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Check out our most popular electronics and gadgets
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-2 rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <Skeleton className="aspect-square rounded-lg mb-3" />
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products available at the moment</p>
              <Button onClick={fetchFeaturedProducts}>Refresh</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((model) => (
                <ProductCard
                  key={model.id}
                  model={model}
                  onModelClick={handleModelClick}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto bg-gradient-to-r from-primary to-accent rounded-lg p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Shop?</h2>
            <p className="text-lg mb-8 opacity-90">
              Browse our extensive collection of premium electronics and find exactly what you need.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Start Shopping Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="flex-1"></div>
      <Footer />

      {/* Product Details Modal - SAME as products page */}
      {selectedModel && selectedProduct && (
        <ProductDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedModel(null)
            setSelectedProduct(null)
          }}
          product={selectedProduct}
          model={selectedModel}
          onCartUpdate={handleCartUpdate}
        />
      )}
    </div>
  )
}