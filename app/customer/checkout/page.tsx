"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Loader2, ShoppingCart } from "lucide-react"
import { fetchUserCart, createOrder, createTransaction } from "@/lib/checkout-service"

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<"address" | "payment" | "review" | "success">("address")
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingCart, setIsFetchingCart] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Sri Lanka",
    phone: "",
    paymentMethod: "1",
  })

  // Fetch cart data on component mount
  useEffect(() => {
    const loadCartData = async () => {
      try {
        setIsFetchingCart(true)
        const cartData = await fetchUserCart()
        setCart(cartData)
        
        // Pre-fill email if available
        const userEmail = localStorage.getItem("userEmail") || ""
        setFormData(prev => ({ ...prev, email: userEmail }))
      } catch (error) {
        console.error("Failed to load cart:", error)
      } finally {
        setIsFetchingCart(false)
      }
    }

    loadCartData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    
    try {
      const orderData = {
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          addressLine2: "",
          city: formData.city,
          state: formData.state || "",
          zipCode: formData.zip || "",
          country: formData.country,
          phone: formData.phone,
          email: formData.email || "",
        },
        paymentMethod: parseInt(formData.paymentMethod),
        customerNotes: "",
      }

      console.log("Creating order:", orderData)
      
      const orderResult = await createOrder(orderData)
      setOrderDetails(orderResult)
      
      setStep("success")
      
    } catch (err: any) {
      alert("Error: " + (err.message || "Failed to create order"))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (step === "address") {
      if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.country || !formData.phone) {
        alert("Please fill all required fields (First Name, Last Name, Address, City, Country, Phone)")
        return
      }
      setStep("payment")
    } else if (step === "payment") {
      setStep("review")
    } else if (step === "review") {
      await handlePlaceOrder()
    }
  }

  const handleBack = () => {
    if (step === "payment") setStep("address")
    else if (step === "review") setStep("payment")
  }

  const shipping = 750;

  const total = cart.total + shipping

  // Show loading while fetching cart
  if (isFetchingCart) {
    return (
      <DashboardLayout requiredRoles={["customer"]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Loading your cart...</h1>
            <p>Fetching your items from the server</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show empty cart message
  if (!isFetchingCart && cart.items.length === 0) {
    return (
      <DashboardLayout requiredRoles={["customer"]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to your cart first</p>
            <Button onClick={() => router.push("/products")}>
              Browse Products
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (step === "success") {
    return (
      <DashboardLayout requiredRoles={["customer"]}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-8">
              Order #{orderDetails?.orderNumber || "000000"} has been confirmed.
            </p>
            <div className="bg-card p-6 rounded-lg mb-8">
              <p className="text-2xl font-bold text-primary mb-2">
                Total: LKR {(orderDetails?.totalAmount || total).toLocaleString()}
              </p>
              <p className="text-muted-foreground">Payment: Cash on Delivery</p>
              <p className="text-muted-foreground">Status: Pending</p>
            </div>
            <Button onClick={() => router.push("/customer/orders")} className="mr-4">
              View Orders
            </Button>
            <Button onClick={() => router.push("/products")} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Cart", href: "/customer/cart" }, { label: "Checkout" }]} />

        <h1 className="text-3xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
              {["address", "payment", "review"].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 2 && <div className="w-12 h-1 bg-border ml-2" />}
                </div>
              ))}
            </div>

            {/* Address Step */}
            {step === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Colombo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Western"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Sri Lanka"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0771234567"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  >
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50">
                      <RadioGroupItem value="1" id="cash-on-delivery" />
                      <Label htmlFor="cash-on-delivery" className="cursor-pointer flex-1">
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold mb-1">Cash on Delivery</p>
                    <p>Pay with cash when your order is delivered. You'll receive a transaction receipt.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Step */}
            {step === "review" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping To</h3>
                      <p className="text-muted-foreground">
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address}
                        <br />
                        {formData.city}, {formData.state} {formData.zip}
                        <br />
                        {formData.country}
                        <br />
                        Phone: {formData.phone}
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-muted-foreground">Cash on Delivery</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cart.items.map((item: any) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-semibold">LKR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <Button onClick={handleBack} variant="outline" disabled={step === "address" || isLoading}>
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : step === "review" ? (
                  "Place Order"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.items.map((item: any) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName || item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        LKR {((item.price || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>LKR {cart.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>LKR {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">LKR {total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}