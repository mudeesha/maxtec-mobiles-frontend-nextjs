"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/common/stats-card"
import { ShoppingCart, Package, Heart, DollarSign } from "lucide-react"
import Link from "next/link"
import { getCart } from "@/lib/cart-store"

export default function CustomerDashboard() {
  const [cart, setCart] = useState({ items: [], total: 0 })

  useEffect(() => {
    const storedCart = getCart()
    setCart(storedCart)
  }, [])

  const mockOrders = [
    { id: 1, date: "2025-01-05", total: 1299.99, status: "delivered" },
    { id: 2, date: "2025-01-02", total: 2499.99, status: "processing" },
  ]

  const mockWishlist = [
    { id: 1, name: "iPhone 15 Pro", price: 1199, image: "/placeholder.svg?key=a1b2c" },
    { id: 2, name: "Galaxy S24 Ultra", price: 1299, image: "/placeholder.svg?key=d3e4f" },
  ]

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard" }]} />

        <h1 className="text-3xl font-bold">Welcome Back!</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Cart Items" value={cart.items.length} icon={<ShoppingCart />} />
          <StatsCard label="Total Orders" value={mockOrders.length} icon={<Package />} />
          <StatsCard label="Wishlist Items" value={mockWishlist.length} icon={<Heart />} />
          <StatsCard
            label="Total Spent"
            value={`$${(mockOrders.reduce((sum, o) => sum + o.total, 0)).toFixed(2)}`}
            icon={<DollarSign />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/customer/profile">Manage Profile</Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/customer/cart">View Cart ({cart.items.length} items)</Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/customer/wishlist">View Wishlist ({mockWishlist.length} items)</Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/customer/payments">Payment Methods</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Wishlist Preview */}
        {mockWishlist.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wishlist Preview</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/wishlist">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockWishlist.map((item) => (
                  <div key={item.id} className="group">
                    <div className="bg-secondary rounded-lg overflow-hidden mb-2 aspect-square flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-primary font-bold">${item.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
