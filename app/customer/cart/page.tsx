"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Trash2, ShoppingCart, Minus, Plus, Loader2, Tag, Info } from "lucide-react"
import { cartApi } from "@/lib/cart-store"

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
      console.log("Cart data loaded:", cart) // Debug log
      setCartItems(cart.items || [])
      setCartTotal(cart.total || 0)
    } catch (error: any) {
      console.log("Cart error:", error.message)
      if (error.message.includes('login') || error.message.includes('authentication')) {
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
      setCartItems(updatedCart.items || [])
      setCartTotal(updatedCart.total || 0)
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update quantity")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleRemove(productId: number) {
    if (!confirm("Remove this item from cart?")) return
    
    try {
      setUpdatingId(productId)
      const updatedCart = await cartApi.removeItem(productId)
      setCartItems(updatedCart.items || [])
      setCartTotal(updatedCart.total || 0)
    } catch (error) {
      console.error("Remove error:", error)
      alert("Failed to remove item")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleClearCart() {
    if (cartItems.length === 0) return
    if (!confirm("Clear entire cart?")) return
    
    try {
      setLoading(true)
      await cartApi.clearCart()
      setCartItems([])
      setCartTotal(0)
    } catch (error) {
      console.error("Clear cart error:", error)
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

  const grandTotal = cartTotal + cartTotal * 0.1 // 10% tax

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
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                    <div key={item.productId} className="flex gap-4 pb-4 mb-4 border-b last:border-0">
                      <div className="flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{item.productName}</h4>
                            
                            {/* Display Attributes */}
                            {item.attributes && item.attributes.length > 0 && (
                              <div className="mt-1 mb-2">
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {item.attributes.slice(0, 3).map((attr: any, index: number) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {attr.type}: {attr.value}
                                    </span>
                                  ))}
                                </div>
                                {item.attributeSummary && (
                                  <p className="text-sm text-gray-600">
                                    <Info className="h-3 w-3 inline mr-1" />
                                    {item.attributeSummary}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg">LKR {item.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">each</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatingId === item.productId || item.quantity <= 1}
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <div className="relative">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1
                                  handleQuantityChange(item.productId, val)
                                }}
                                className="w-16 text-center"
                                disabled={updatingId === item.productId}
                                min="1"
                              />
                              {updatingId === item.productId && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              )}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatingId === item.productId}
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              LKR {(item.price * item.quantity).toLocaleString()}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={updatingId === item.productId}
                              onClick={() => handleRemove(item.productId)}
                              className="mt-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({cartItems.length})</span>
                      <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold">LKR {cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">LKR {grandTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All prices in Sri Lankan Rupees (LKR)
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-4">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}