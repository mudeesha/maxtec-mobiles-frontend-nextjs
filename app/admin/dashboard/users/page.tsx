"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Users, Eye } from "lucide-react"
import { getUsers, addUser, deleteUser, updateUser, type User } from "@/lib/admin-store"

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    setItems(getUsers())
  }, [])

  const handleAdd = () => {
    setEditingId(null)
    setProfileImage(null)
    setFormData({ name: "", email: "", role: "customer", status: "active" })
    setIsModalOpen(true)
  }

  const handleEdit = (item: User) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status,
    })
    const savedImage = localStorage.getItem(`userProfile_${item.id}`)
    setProfileImage(savedImage)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return

    if (editingId !== null) {
      updateUser(editingId, formData.name, formData.email, formData.role, formData.status)
    } else {
      addUser(formData.name, formData.email, formData.role, formData.status)
    }

    setItems(getUsers())
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    deleteUser(id)
    setItems(getUsers())
    setDeleteConfirm(null)
  }

  const handleViewUser = (user: User) => {
    setViewingUser(user)
    setIsViewModalOpen(true)
    const savedImage = localStorage.getItem(`userProfile_${user.id}`)
    setProfileImage(savedImage)
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setProfileImage(imageData)
        if (editingId !== null) {
          localStorage.setItem(`userProfile_${editingId}`, imageData)
        }
      }
      reader.readAsDataURL(file)
    }
  }

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
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Users" }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">{items.length} Users</span>
          </div>
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
            {
              header: "Actions",
              accessor: "id",
              render: (id) => {
                const item = items.find((i) => i.id === id)
                return (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => item && handleViewUser(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => item && handleEdit(item)}>
                      <Edit className="h-4 w-4" />
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
          data={items}
          title="Users"
          onAddClick={handleAdd}
        />

        {/* Delete Confirmation */}
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
            <p className="text-foreground">Are you sure you want to delete this user?</p>
          </Modal>
        )}

        {/* View User Details Modal */}
        {viewingUser && (
          <Modal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            title="User Details"
            size="lg"
            footer={
              <>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </>
            }
          >
            <div className="space-y-6">
              {/* Profile Image Section - View Only */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt={viewingUser.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-primary text-2xl font-bold">
                      {viewingUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold text-lg">{viewingUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-lg">{viewingUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge className={getRoleColor(viewingUser.role)}>
                      {viewingUser.role.charAt(0).toUpperCase() + viewingUser.role.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(viewingUser.status)}>
                      {viewingUser.status.charAt(0).toUpperCase() + viewingUser.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-semibold">{viewingUser.joinDate}</p>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Add/Edit Modal - Profile picture upload now in this modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Edit User" : "Add New User"}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingId ? "Update" : "Create"}</Button>
            </>
          }
        >
          <div className="space-y-5">
            {/* Profile Image Upload Section */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">Profile Picture</Label>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-dashed border-border text-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="profileFile" className="block text-sm font-medium mb-2">
                    Upload Photo
                  </Label>
                  <Input
                    id="profileFile"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="cursor-pointer text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max 2MB)</p>
                </div>
              </div>
            </div>

            {/* User Information Section */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="font-medium text-sm">
                    Role
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="font-medium text-sm">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
