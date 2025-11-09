"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { StatsCard } from "@/components/common/stats-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Package, AlertCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { products, brands, models } from "@/lib/mock-data"

const inventoryData = [
  { category: "In Stock", value: products.filter((p) => p.stockQuantity > 50).length },
  { category: "Low Stock", value: products.filter((p) => p.stockQuantity <= 50 && p.stockQuantity > 0).length },
  { category: "Out of Stock", value: products.filter((p) => p.stockQuantity === 0).length },
]

const chartData = [
  { month: "Jan", products: 45 },
  { month: "Feb", products: 38 },
  { month: "Mar", products: 52 },
  { month: "Apr", products: 61 },
  { month: "May", products: 48 },
  { month: "Jun", products: 67 },
]

export default function StaffDashboard() {
  const lowStockCount = products.filter((p) => p.stockQuantity <= 50 && p.stockQuantity > 0).length

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard" }]} />

        <h1 className="text-3xl font-bold">Staff Dashboard</h1>

        {/* Alert for Low Stock */}
        {lowStockCount > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">{lowStockCount} products with low stock</p>
              <p className="text-sm text-yellow-700">Please review and request inventory replenishment as needed.</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            label="Total Products"
            value={products.length}
            icon={<Package />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            label="Low Stock Items"
            value={lowStockCount}
            icon={<AlertCircle />}
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard
            label="Active Brands"
            value={brands.length}
            icon={<TrendingUp />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Catalog Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="products" fill="#3B82F6" name="Products Added" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.category === "In Stock" ? "bg-green-500" : item.category === "Low Stock" ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${(item.value / products.length) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Models</p>
              <p className="text-2xl font-bold mt-2">{models.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg. Price</p>
              <p className="text-2xl font-bold mt-2">
                ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Stock %</p>
              <p className="text-2xl font-bold mt-2">
                {Math.round((products.filter((p) => p.stockQuantity > 0).length / products.length) * 100)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold mt-2">
                ${(products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0) / 1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
