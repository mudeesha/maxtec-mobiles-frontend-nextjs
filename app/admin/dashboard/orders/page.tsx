"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/common/modal"
import { Label } from "@/components/ui/label"
import { Eye, Trash2 } from "lucide-react"

const mockOrders = [
  {
    id: 1,
    customer: "John Doe",
    total: 2499.99,
    status: "completed",
    date: "2025-01-08",
    items: ["iPhone 15 Pro", "Apple Case"],
    tracking: "TRK001",
  },
  {
    id: 2,
    customer: "Jane Smith",
    total: 1899.99,
    status: "pending",
    date: "2025-01-07",
    items: ["Galaxy S24 Ultra"],
    tracking: "TRK002",
  },
  {
    id: 3,
    customer: "Bob Wilson",
    total: 3299.99,
    status: "shipped",
    date: "2025-01-06",
    items: ["MacBook Pro", "Magic Mouse"],
    tracking: "TRK003",
  },
  {
    id: 4,
    customer: "Alice Brown",
    total: 999.99,
    status: "completed",
    date: "2025-01-05",
    items: ["iPad Air"],
    tracking: "TRK004",
  },
  {
    id: 5,
    customer: "Charlie Davis",
    total: 1599.99,
    status: "cancelled",
    date: "2025-01-04",
    items: ["AirPods Pro"],
    tracking: "TRK005",
  },
]

export default function OrdersPage() {
  const [viewingOrder, setViewingOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [orders, setOrders] = useState(mockOrders)
  const [statusChangeId, setStatusChangeId] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState<string>("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
    }
  }

  const handleStatusChange = (orderId: number, status: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))
    setStatusChangeId(null)
  }

  const handleDelete = (id: number) => {
    setOrders(orders.filter((o) => o.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Orders" }]} />

        <h1 className="text-3xl font-bold">Orders Management</h1>

        <DataTable
          columns={[
            { header: "Order ID", accessor: "id" },
            { header: "Customer", accessor: "customer" },
            { header: "Date", accessor: "date" },
            { header: "Total", accessor: "total", render: (total) => `$${total.toFixed(2)}` },
            {
              header: "Status",
              accessor: "status",
              render: (status) => (
                <Badge className={getStatusColor(status)}>
                  {(status as string).charAt(0).toUpperCase() + (status as string).slice(1)}
                </Badge>
              ),
            },
            {
              header: "Actions",
              accessor: "id",
              render: (id) => {
                const order = orders.find((o) => o.id === id)
                return (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => order && setViewingOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusChangeId(id)
                        setNewStatus(order?.status || "")
                      }}
                    >
                      Change Status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => setDeleteConfirm(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              },
            },
          ]}
          data={orders}
          title="Orders"
        />

        {/* View Order Modal */}
        {viewingOrder && (
          <Modal
            isOpen={!!viewingOrder}
            onClose={() => setViewingOrder(null)}
            title={`Order #${viewingOrder.id}`}
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
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">{viewingOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{viewingOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold text-lg text-primary">${viewingOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tracking</p>
                  <p className="font-semibold">{viewingOrder.tracking}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Badge className={getStatusColor(viewingOrder.status)}>
                  {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="space-y-1 bg-secondary/50 p-3 rounded-lg">
                  {viewingOrder.items.map((item, idx) => (
                    <p key={idx} className="text-sm">
                      • {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {statusChangeId !== null && (
          <Modal
            isOpen={true}
            onClose={() => setStatusChangeId(null)}
            title="Change Order Status"
            footer={
              <>
                <Button variant="outline" onClick={() => setStatusChangeId(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleStatusChange(statusChangeId, newStatus)}>Update Status</Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="status" className="font-medium">
                  Select New Status
                </Label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground mt-2"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm !== null && (
          <Modal
            isOpen={true}
            onClose={() => setDeleteConfirm(null)}
            title="Confirm Delete"
            footer={
              <>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                  Delete
                </Button>
              </>
            }
          >
            <p className="text-foreground">Are you sure you want to delete this order? This action cannot be undone.</p>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}
