"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { StatsCard } from "@/components/common/stats-card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { products, brands, models, attributeTypes } from "@/lib/mock-data"

const chartData = [
  { month: "Jan", sales: 4000, orders: 24 },
  { month: "Feb", sales: 3000, orders: 21 },
  { month: "Mar", sales: 2000, orders: 19 },
  { month: "Apr", sales: 2780, orders: 32 },
  { month: "May", sales: 1890, orders: 23 },
  { month: "Jun", sales: 2390, orders: 34 },
]

export default function AdminDashboard() {
  const totalProducts = products.length
  const totalSales = products.reduce((sum, p) => sum + p.price, 0)
  const totalOrders = 152
  const totalUsers = 1240

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard" }]} />

        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Products"
            value={totalProducts}
            icon={<Package />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            label="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            label="Total Revenue"
            value={`$${totalSales.toLocaleString()}`}
            icon={<DollarSign />}
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard label="Total Users" value={totalUsers} icon={<Users />} trend={{ value: 23, isPositive: true }} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Brands</p>
              <p className="text-2xl font-bold mt-2">{brands.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Models</p>
              <p className="text-2xl font-bold mt-2">{models.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Attribute Types</p>
              <p className="text-2xl font-bold mt-2">{attributeTypes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold mt-2">{products.filter((p) => p.stockQuantity > 0).length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
