// app/customer/cart/page.tsx - SIMPLE VERSION
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Trash2, ShoppingCart, Minus, Plus, Loader2 } from "lucide-react"
import { cartApi } from "@/lib/cart-store" // Import from cart-store

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const router = useRouter()

  // Load cart from backend
  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    try {
      setLoading(true)
      const cart = await cartApi.getCart()
      setCartItems(cart.items || [])
      setCartTotal(cart.total || 0)
    } catch (error: any) {
      console.log("Cart error:", error.message)
      if (error.message.includes('login')) {
        alert("Please login to view cart")
        router.push("/login")
      }
      setCartItems([])
      setCartTotal(0)
    } finally {
      setLoading(false)
    }
  }

  async function handleQuantityChange(productId: number, newQty: number) {
    if (newQty < 1) return
    
    try {
      setUpdatingId(productId)
      const updatedCart = await cartApi.updateItem(productId, newQty)
      setCartItems(updatedCart.items)
      setCartTotal(updatedCart.total)
    } catch (error) {
      alert("Failed to update quantity")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleRemove(productId: number) {
    if (!confirm("Remove this item?")) return
    
    try {
      setUpdatingId(productId)
      const updatedCart = await cartApi.removeItem(productId)
      setCartItems(updatedCart.items)
      setCartTotal(updatedCart.total)
    } catch (error) {
      alert("Failed to remove item")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleClearCart() {
    if (!confirm("Clear entire cart?")) return
    if (cartItems.length === 0) return
    
    try {
      setLoading(true)
      await cartApi.clearCart()
      setCartItems([])
      setCartTotal(0)
    } catch (error) {
      alert("Failed to clear cart")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty")
      return
    }
    router.push("/customer/checkout")
  }

  const tax = cartTotal * 0.1
  const grandTotal = cartTotal + tax

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Cart" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={loading}
              className="text-red-500"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-4">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some items to get started</p>
              <Button onClick={() => router.push("/products")}>Shop Now</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-4 pb-4 mb-4 border-b">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === item.productId || item.quantity <= 1}
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1
                              handleQuantityChange(item.productId, val)
                            }}
                            className="w-16 text-center"
                            disabled={updatingId === item.productId}
                          />
                          
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === item.productId}
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === item.productId}
                            onClick={() => handleRemove(item.productId)}
                            className="ml-4 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    <span>Subtotal</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold">${grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full" 
                    size="lg"
                    disabled={loading || cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    onClick={() => router.push("/products")} 
                    variant="outline" 
                    className="w-full"
                  >
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