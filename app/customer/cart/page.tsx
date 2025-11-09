"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react"
import { type CartItem, getCart, removeFromCart, updateQuantity, clearCart } from "@/lib/cart-store"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const storedCart = getCart()
    setCart(storedCart.items)
    setTotal(storedCart.total)
    setLoading(false)

    const handleCartUpdate = () => {
      const updated = getCart()
      setCart(updated.items)
      setTotal(updated.total)
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const handleRemove = (productId: number) => {
    const updated = removeFromCart(productId)
    setCart(updated.items)
    setTotal(updated.total)
  }

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return
    const updated = updateQuantity(productId, quantity)
    setCart(updated.items)
    setTotal(updated.total)
  }

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart()
      setCart([])
      setTotal(0)
    }
  }

  const handleCheckout = () => {
    router.push("/customer/checkout")
  }

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Cart" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {cart.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : cart.length === 0 ? (
          <Card>
            <CardContent className="pt-12">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Start shopping to add items to your cart.</p>
                <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Items ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex gap-4 pb-4 border-b border-border last:border-0">
                        {/* Image */}
                        <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-lg font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Total & Remove */}
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.productId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">${(total + total * 0.1).toFixed(2)}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button onClick={() => router.push("/products")} variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
