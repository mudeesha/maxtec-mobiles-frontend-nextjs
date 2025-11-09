"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/common/modal"
import { Toast } from "@/components/common/toast"
import { Eye, X } from "lucide-react"

const mockOrders = [
  {
    id: 1001,
    date: "2025-01-05",
    total: 1299.99,
    status: "delivered",
    items: ["iPhone 15 Pro", "Apple Case"],
    tracking: "TRACK123456",
  },
  {
    id: 1002,
    date: "2025-01-02",
    total: 2499.99,
    status: "processing",
    items: ["Galaxy S24 Ultra", "Screen Protector", "Charging Cable"],
    tracking: "TRACK123457",
  },
  {
    id: 1003,
    date: "2024-12-28",
    total: 899.99,
    status: "shipped",
    items: ["Pixel 9"],
    tracking: "TRACK123458",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [viewingOrder, setViewingOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
      case "shipped":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
    }
  }

  const handleCancelOrder = (id: number) => {
    const order = orders.find((o) => o.id === id)
    if (order && order.status === "processing") {
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)))
      setToast({ message: `Order #${id} has been cancelled.`, type: "success" })
      setCancelConfirm(null)
    }
  }

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Orders" }]} />

        <h1 className="text-3xl font-bold">My Orders</h1>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="pt-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button asChild>
                    <a href="/products">Start Shopping</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #</p>
                      <p className="font-semibold">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold text-lg text-primary">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)} className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {order.status === "processing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 gap-2"
                          onClick={() => setCancelConfirm(order.id)}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Order Details Modal */}
        {viewingOrder && (
          <Modal
            isOpen={!!viewingOrder}
            onClose={() => setViewingOrder(null)}
            title={`Order #${viewingOrder.id} Details`}
            size="lg"
            footer={
              <Button variant="outline" onClick={() => setViewingOrder(null)}>
                Close
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">{viewingOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-semibold">{viewingOrder.tracking}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg text-primary">${viewingOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(viewingOrder.status)}>
                    {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Order Items</p>
                <div className="space-y-2 bg-secondary/50 p-3 rounded-lg">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>• {item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Cancel Order Confirmation Modal */}
        {cancelConfirm !== null && (
          <Modal
            isOpen={true}
            onClose={() => setCancelConfirm(null)}
            title="Cancel Order"
            footer={
              <>
                <Button variant="outline" onClick={() => setCancelConfirm(null)}>
                  Keep Order
                </Button>
                <Button variant="destructive" onClick={() => handleCancelOrder(cancelConfirm)}>
                  Yes, Cancel Order
                </Button>
              </>
            }
          >
            <p className="text-foreground">Are you sure you want to cancel this order? This action cannot be undone.</p>
          </Modal>
        )}

        {/* Toast Notification */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </DashboardLayout>
  )
}
