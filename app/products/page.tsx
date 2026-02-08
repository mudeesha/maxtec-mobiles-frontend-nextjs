"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Filter, X, Sliders } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductDetailsModal } from "@/components/products/product-details-modal"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/products/product-card"
import { 
  productService, 
  type ModelListingDto, 
  type ProductVariantDto, 
  type Brand 
} from "@/services/productService"
import { ITEMS_PER_PAGE, filterDefaults } from "@/constants/productConstants"

export default function ProductsPage() {
  const [models, setModels] = useState<ModelListingDto[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState(filterDefaults.searchQuery)
  const [selectedBrand, setSelectedBrand] = useState<number | null>(filterDefaults.selectedBrand)
  const [minPrice, setMinPrice] = useState(filterDefaults.minPrice)
  const [maxPrice, setMaxPrice] = useState(filterDefaults.maxPrice)
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">(filterDefaults.sortBy)
  const [selectedProduct, setSelectedProduct] = useState<ProductVariantDto | null>(null)
  const [selectedModel, setSelectedModel] = useState<ModelListingDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [cartRefresh, setCartRefresh] = useState(0)

  const fetchModels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await productService.fetchModels()
      setModels(data)

      const uniqueBrands = productService.extractBrandsFromModels(data)
      setBrands(uniqueBrands)
      
      const calculatedMaxPrice = productService.calculateMaxPrice(data)
      setMaxPrice(calculatedMaxPrice)
    } catch (err) {
      console.error("Error fetching models:", err)
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const filteredModels = useMemo(() => {
    return productService.filterModels(models, searchQuery, selectedBrand, minPrice, maxPrice)
  }, [models, searchQuery, selectedBrand, minPrice, maxPrice])

  const sortedModels = useMemo(() => {
    return productService.sortModels(filteredModels, sortBy)
  }, [filteredModels, sortBy])

  const totalPages = productService.calculateTotalPages(sortedModels, ITEMS_PER_PAGE)
  const paginatedModels = productService.paginateModels(sortedModels, currentPage, ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleModelClick = (model: ModelListingDto) => {
    const defaultProduct = productService.getDefaultProduct(model)
    if (defaultProduct) {
      setSelectedModel(model)
      setSelectedProduct(defaultProduct)
      setIsModalOpen(true)
    }
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery(filterDefaults.searchQuery)
    setSelectedBrand(filterDefaults.selectedBrand)
    setMinPrice(filterDefaults.minPrice)
    if (models.length > 0) {
      const calculatedMaxPrice = productService.calculateMaxPrice(models)
      setMaxPrice(calculatedMaxPrice)
    }
    setSortBy(filterDefaults.sortBy)
    handleFilterChange()
  }

  const handleCartUpdate = () => {
    setCartRefresh((prev) => prev + 1)
  }

  useEffect(() => {
    fetchModels()
  }, [])

  useEffect(() => {
    if (models.length > 0) {
      const calculatedMaxPrice = productService.calculateMaxPrice(models)
      setMaxPrice(calculatedMaxPrice)
    }
  }, [models])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto w-full px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex gap-6">
            <div className="hidden lg:block w-80">
              <Skeleton className="h-[600px] rounded-xl" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-8" />
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto w-full px-4 py-8 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Products</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchModels}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2 text-balance">Shop Our Collection</h1>
          <p className="text-muted-foreground text-lg">
            Browse {models.length} premium models with multiple configurations
          </p>
        </div>
      </section>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for models, brands..."
              className="pl-12 py-3 text-base bg-card border-2 border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleFilterChange()
              }}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6 bg-card rounded-xl p-6 border-2 border-border shadow-sm">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">Filters</h3>
                </div>
                {(searchQuery || selectedBrand || minPrice > 0 || maxPrice < 150000 || sortBy !== "featured") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Sort */}
              <div className="space-y-3 pb-6 border-b border-border">
                <h4 className="font-semibold text-sm text-foreground">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pb-6 border-b border-border">
                <h4 className="font-semibold text-sm text-foreground">Price Range (Rs.)</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(Number(e.target.value) || 0)
                          handleFilterChange()
                        }}
                        className="w-full text-sm bg-background border-2 border-border rounded-lg focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                      <Input
                        type="number"
                        placeholder={maxPrice.toString()}
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(Number(e.target.value) || 150000)
                          handleFilterChange()
                        }}
                        className="w-full text-sm bg-background border-2 border-border rounded-lg focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                    <span className="font-medium">Rs. {minPrice.toLocaleString()}</span>
                    <span>—</span>
                    <span className="font-medium">Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-3 pb-6 border-b border-border">
                <h4 className="font-semibold text-sm text-foreground">Brands</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  <Button
                    variant={selectedBrand === null ? "default" : "outline"}
                    className="w-full justify-start text-sm h-9 rounded-lg font-medium"
                    onClick={() => {
                      setSelectedBrand(null)
                      handleFilterChange()
                    }}
                  >
                    All Brands
                  </Button>
                  {brands.map((brand) => (
                    <Button
                      key={brand.id}
                      variant={selectedBrand === brand.id ? "default" : "outline"}
                      className="w-full justify-start text-sm h-9 rounded-lg"
                      onClick={() => {
                        setSelectedBrand(brand.id)
                        handleFilterChange()
                      }}
                    >
                      {brand.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filter Summary Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <CardContent className="pt-4">
                  <p className="text-sm text-foreground">
                    Showing <span className="font-bold text-primary">{sortedModels.length}</span> models
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total variants: <span className="font-medium">
                      {models.reduce((total, model) => total + model.products.length, 0)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:hidden mb-6 w-full">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full h-10 rounded-lg border-2 font-semibold gap-2"
            >
              <Filter className="h-4 w-4" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            {showMobileFilters && (
              <div className="mt-4 bg-card rounded-xl p-4 border-2 border-border space-y-4">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm bg-background text-foreground"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Price Range (Rs.)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(Number(e.target.value) || 0)
                        handleFilterChange()
                      }}
                      className="w-full text-sm bg-background border-2 border-border rounded-lg"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(Number(e.target.value) || 150000)
                        handleFilterChange()
                      }}
                      className="w-full text-sm bg-background border-2 border-border rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full text-sm h-9 rounded-lg bg-transparent"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header with results count */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                {sortedModels.length === 0 ? "No Models" : `${sortedModels.length} Phone Models`}
              </h2>
              {totalPages > 1 && (
                <div className="text-sm text-muted-foreground font-medium">
                  Page <span className="text-primary font-bold">{currentPage}</span> of{" "}
                  <span className="font-bold">{totalPages}</span>
                </div>
              )}
            </div>

            {sortedModels.length === 0 ? (
              <Card className="border-2 border-border">
                <CardContent className="pt-16 pb-16 text-center">
                  <p className="text-muted-foreground mb-6 text-lg">No models found matching your criteria</p>
                  <Button onClick={resetFilters} className="rounded-lg">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {paginatedModels.map((model) => (
                    <ProductCard
                      key={model.id}
                      model={model}
                      onModelClick={handleModelClick}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-12 flex-wrap">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 w-10 rounded-lg border-2 font-semibold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let page: number
                        if (totalPages <= 7) {
                          page = i + 1
                        } else if (currentPage <= 4) {
                          page = i + 1
                        } else if (currentPage > totalPages - 4) {
                          page = totalPages - 6 + i
                        } else {
                          page = currentPage - 3 + i
                        }

                        if (page < 1 || page > totalPages) return null

                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className="h-10 w-10 rounded-lg border-2 font-semibold hover:bg-primary hover:text-white hover:border-primary"
                          >
                            {page}
                          </Button>
                        )
                      })}
                      {totalPages > 7 && currentPage < totalPages - 3 && (
                        <span className="text-muted-foreground font-semibold px-2">...</span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-10 w-10 rounded-lg border-2 font-semibold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Product Details Modal */}
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