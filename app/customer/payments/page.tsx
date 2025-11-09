"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Trash2, Plus } from "lucide-react"
import { Modal } from "@/components/common/modal"

const mockPayments = [
  {
    id: 1,
    type: "credit_card",
    last4: "4242",
    brand: "Visa",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "credit_card",
    last4: "5555",
    brand: "Mastercard",
    expiry: "08/26",
    isDefault: false,
  },
]

const mockTransactions = [
  { id: 1, date: "2025-01-05", amount: 1299.99, status: "completed", description: "Order #1001" },
  { id: 2, date: "2025-01-02", amount: 2499.99, status: "completed", description: "Order #1002" },
  { id: 3, date: "2024-12-28", amount: 899.99, status: "completed", description: "Order #1003" },
]

export default function PaymentsPage() {
  const [isAddingCard, setIsAddingCard] = useState(false)

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Payments" }]} />

        <h1 className="text-3xl font-bold">Payment Methods & History</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saved Payment Methods */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Saved Methods</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setIsAddingCard(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-sm">{payment.brand}</p>
                          <p className="text-xs text-muted-foreground">****{payment.last4}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Expires {payment.expiry}</p>
                      {payment.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${transaction.amount.toFixed(2)}</p>
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">{transaction.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Payment Method Modal */}
        <Modal
          isOpen={isAddingCard}
          onClose={() => setIsAddingCard(false)}
          title="Add Payment Method"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddingCard(false)}>Add Card</Button>
            </>
          }
        >
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-4">
            <p>This is a placeholder form. In production, integrate with a secure payment processor.</p>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
