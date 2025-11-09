"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { addToCart } from "@/lib/cart-store"

const mockWishlist = [
  { id: 1, name: "iPhone 15 Pro", price: 1199, image: "/placeholder.svg?key=a1b2c", brand: "Apple", stock: 5 },
  { id: 2, name: "Galaxy S24 Ultra", price: 1299, image: "/placeholder.svg?key=d3e4f", brand: "Samsung", stock: 3 },
  { id: 3, name: "Pixel 9 Pro", price: 999, image: "/placeholder.svg?key=g5h6i", brand: "Google", stock: 8 },
  { id: 4, name: "iPad Pro", price: 1099, image: "/placeholder.svg?key=j7k8l", brand: "Apple", stock: 0 },
  { id: 5, name: "Galaxy Tab S9", price: 799, image: "/placeholder.svg?key=m9n0o", brand: "Samsung", stock: 4 },
  { id: 6, name: "AirPods Pro Max", price: 549, image: "/placeholder.svg?key=p1q2r", brand: "Apple", stock: 6 },
  { id: 7, name: "MacBook Pro", price: 1999, image: "/placeholder.svg?key=s3t4u", brand: "Apple", stock: 2 },
  { id: 8, name: "Surface Pro", price: 1299, image: "/placeholder.svg?key=v5w6x", brand: "Microsoft", stock: 1 },
]

export default function WishlistPage() {
  const [items, setItems] = useState(mockWishlist)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const handleRemove = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  const handleAddToCart = (item: (typeof mockWishlist)[0]) => {
    addToCart({
      productId: item.id,
      quantity: 1,
      price: item.price,
      name: item.name,
      image: item.image,
    })
  }

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Wishlist" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <span className="text-muted-foreground">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="pt-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                <Button>Continue Shopping</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-all duration-300 hover:border-primary/30 group h-full flex flex-col"
                >
                  <CardContent className="pt-3 p-3 flex-1 flex flex-col">
                    <div className="aspect-square bg-secondary rounded-md mb-3 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{item.brand}</p>

                    {item.stock > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 text-xs mb-2 w-fit"
                      >
                        In Stock
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-destructive/10 text-destructive border-destructive/20 text-xs mb-2 w-fit"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 py-2 px-3">
                    <p className="text-base font-bold text-primary">${item.price.toFixed(2)}</p>
                    <div className="flex gap-2 w-full">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock === 0}
                        className="flex-1 text-xs"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 p-0 text-sm"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
