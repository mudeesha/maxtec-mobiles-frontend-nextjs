"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { getUsers, type User } from "@/lib/admin-store"

export default function StaffUsersPage() {
  const [items, setItems] = useState<User[]>([])

  useEffect(() => {
    setItems(getUsers())
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400"
      case "staff":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
      case "customer":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
  }

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/staff/dashboard" }, { label: "Users" }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">View system users and their information</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">{items.length} Users</span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-400">
          <p className="font-semibold mb-1">View Only</p>
          <p>As a staff member, you have read-only access to user information. You cannot edit or delete users.</p>
        </div>

        <DataTable
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            {
              header: "Role",
              accessor: "role",
              render: (role) => (
                <Badge className={getRoleColor(role)}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
              ),
            },
            {
              header: "Status",
              accessor: "status",
              render: (status) => (
                <Badge className={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
              ),
            },
            { header: "Join Date", accessor: "joinDate" },
          ]}
          data={items}
          title="Users"
        />
      </div>
    </DashboardLayout>
  )
}
