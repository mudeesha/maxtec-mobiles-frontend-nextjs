"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Filter, X, Sliders } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ProductDetailsModal } from "@/components/products/product-details-modal"
import {
  products,
  brands,
  models,
  getProductName,
  getBrandName,
  getDefaultImage,
  getAttributeValuesText,
} from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const ITEMS_PER_PAGE = 12

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [cartRefresh, setCartRefresh] = useState(0)

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const productName = getProductName(product).toLowerCase()
      const brandName = getBrandName(product).toLowerCase()
      const matchesSearch =
        !searchQuery || productName.includes(searchQuery.toLowerCase()) || brandName.includes(searchQuery.toLowerCase())
      const matchesBrand = !selectedBrand || models.find((m) => m.id === product.modelId)?.brandId === selectedBrand
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice
      return matchesSearch && matchesBrand && matchesPrice
    })

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      filtered.sort((a, b) => getProductName(a).localeCompare(getProductName(b)))
    }

    return filtered
  }, [searchQuery, selectedBrand, minPrice, maxPrice, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleProductClick = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedBrand(null)
    setMinPrice(0)
    setMaxPrice(10000)
    setSortBy("featured")
    handleFilterChange()
  }

  const handleCartUpdate = () => {
    setCartRefresh((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2 text-balance">Shop Our Collection</h1>
          <p className="text-muted-foreground text-lg">
            Browse {products.length} premium products with advanced filtering and sorting options
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products, brands, models..."
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
                {(searchQuery || selectedBrand || minPrice > 0 || maxPrice < 10000 || sortBy !== "featured") && (
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
                    setSortBy(e.target.value)
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
                <h4 className="font-semibold text-sm text-foreground">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(Number.parseInt(e.target.value) || 0)
                          handleFilterChange()
                        }}
                        className="w-full text-sm bg-background border-2 border-border rounded-lg focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                      <Input
                        type="number"
                        placeholder="10000"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(Number.parseInt(e.target.value) || 10000)
                          handleFilterChange()
                        }}
                        className="w-full text-sm bg-background border-2 border-border rounded-lg focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                    <span className="font-medium">${minPrice}</span>
                    <span>—</span>
                    <span className="font-medium">${maxPrice}</span>
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
                    Showing <span className="font-bold text-primary">{filteredProducts.length}</span> products
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
                    setSortBy(e.target.value)
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
                  <label className="text-sm font-semibold text-foreground">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(Number.parseInt(e.target.value) || 0)
                        handleFilterChange()
                      }}
                      className="w-full text-sm bg-background border-2 border-border rounded-lg"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(Number.parseInt(e.target.value) || 10000)
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
                {filteredProducts.length === 0 ? "No Products" : `${filteredProducts.length} Products`}
              </h2>
              {totalPages > 1 && (
                <div className="text-sm text-muted-foreground font-medium">
                  Page <span className="text-primary font-bold">{currentPage}</span> of{" "}
                  <span className="font-bold">{totalPages}</span>
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="border-2 border-border">
                <CardContent className="pt-16 pb-16 text-center">
                  <p className="text-muted-foreground mb-6 text-lg">No products found matching your criteria</p>
                  <Button onClick={resetFilters} className="rounded-lg">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-xl transition-all duration-300 hover:border-primary hover:-translate-y-1 cursor-pointer group border-2 rounded-xl overflow-hidden"
                      onClick={() => handleProductClick(product)}
                    >
                      <CardContent className="pt-3 p-3">
                        {/* Image container with overlay */}
                        <div className="aspect-square bg-gradient-to-br from-secondary to-secondary/50 rounded-lg mb-3 overflow-hidden flex items-center justify-center relative group">
                          <img
                            src={getDefaultImage(product) || "/placeholder.svg"}
                            alt={getProductName(product)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {/* Quick view overlay badge */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">Quick View</span>
                          </div>
                        </div>

                        {/* Product details */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-foreground">
                            {getProductName(product)}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {getAttributeValuesText(product)}
                          </p>

                          {/* Stock badge */}
                          {product.stockQuantity > 0 ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs rounded-full">
                              ✓ In Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs rounded-full">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col gap-2.5 py-3 px-3 border-t border-border bg-background/50">
                        <div className="w-full">
                          <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground line-through">
                            ${(product.price * 1.15).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs bg-transparent rounded-lg border-2 hover:bg-primary hover:text-white hover:border-primary transition-all font-semibold"
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
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
