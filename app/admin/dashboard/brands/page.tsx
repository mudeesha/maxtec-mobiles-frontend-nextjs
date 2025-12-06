"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit2 } from "lucide-react"

// Define Brand interface
export interface Brand {
  id: number
  name: string
}

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch brands from backend API
  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://localhost:44306/api/Brands", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch brands: ${response.status}`)
      }

      const data: Brand[] = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Error fetching brands:", err)
      setError(err instanceof Error ? err.message : "Failed to load brands")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Brand) => {
    setEditingItem(item)
    setFormData({ name: item.name })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (editingItem) {
        // Update existing brand
        const response = await fetch(`https://localhost:44306/api/Brands/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: editingItem.id,
            name: formData.name.trim()
          })
        })

        if (!response.ok) {
          throw new Error("Failed to update brand")
        }
      } else {
        // Create new brand
        const response = await fetch("https://localhost:44306/api/Brands", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name.trim()
          })
        })

        if (!response.ok) {
          throw new Error("Failed to create brand")
        }
      }

      // Refresh the data
      await fetchBrands()
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving brand:", err)
      setError(err instanceof Error ? err.message : "Failed to save brand")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://localhost:44306/api/Brands/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete brand")
      }

      // Refresh the data
      await fetchBrands()
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting brand:", err)
      setError(err instanceof Error ? err.message : "Failed to delete brand")
    }
  }

  // Retry function for error state
  const handleRetry = () => {
    setError(null)
    fetchBrands()
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Brands" }]} />

        <h1 className="text-3xl font-bold">Brands</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <DataTable
            columns={[
              { header: "ID", accessor: "id" },
              { header: "Name", accessor: "name" },
              {
                header: "Actions",
                accessor: "id",
                render: (id, row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row as Brand)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive bg-transparent"
                      onClick={() => setDeleteConfirm(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={items}
            title="Brands"
            onAddClick={handleAdd}
          />
        )}

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
            <p>Are you sure you want to delete this brand?</p>
          </Modal>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Edit Brand" : "Add Brand"}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name.trim()}>
                {editingItem ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="e.g., Apple, Samsung"
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}