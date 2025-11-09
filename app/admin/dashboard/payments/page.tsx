"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const salesData = [
  { month: "Jan", credit: 4000, debit: 2400, paypal: 2400 },
  { month: "Feb", credit: 3000, debit: 1398, paypal: 2210 },
  { month: "Mar", credit: 2000, debit: 9800, paypal: 2290 },
  { month: "Apr", credit: 2780, debit: 3908, paypal: 2000 },
  { month: "May", credit: 1890, debit: 4800, paypal: 2181 },
  { month: "Jun", credit: 2390, debit: 3800, paypal: 2500 },
]

const paymentMethods = [
  { name: "Credit Card", value: 45, color: "#3B82F6" },
  { name: "Debit Card", value: 30, color: "#10B981" },
  { name: "PayPal", value: 25, color: "#F59E0B" },
]

export default function PaymentsPage() {
  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Payments" }]} />

        <h1 className="text-3xl font-bold">Payment Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-2">$124,580</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold mt-2">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg. Transaction</p>
              <p className="text-2xl font-bold mt-2">$101.12</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="credit" fill="#3B82F6" name="Credit Card" />
                  <Bar dataKey="debit" fill="#10B981" name="Debit Card" />
                  <Bar dataKey="paypal" fill="#F59E0B" name="PayPal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
