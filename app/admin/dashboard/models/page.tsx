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

// Define interfaces
export interface Brand {
  id: number
  name: string
}

export interface Model {
  id: number
  name: string
  brandId: number
  brand?: Brand
}

export default function ModelsPage() {
  const [items, setItems] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Model | null>(null)
  const [formData, setFormData] = useState({ name: "", brandId: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch models from backend API
  const fetchModels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://localhost:44306/api/Models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`)
      }

      const data: Model[] = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Error fetching models:", err)
      setError(err instanceof Error ? err.message : "Failed to load models")
    } finally {
      setLoading(false)
    }
  }

  // Fetch brands from backend API
  const fetchBrands = async () => {
    try {
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
        throw new Error("Failed to fetch brands")
      }

      const data: Brand[] = await response.json()
      setBrands(data)
      
      // Set default brand ID for form
      if (data.length > 0 && formData.brandId === 0) {
        setFormData(prev => ({ ...prev, brandId: data[0].id }))
      }
    } catch (err) {
      console.error("Error fetching brands:", err)
      setError(err instanceof Error ? err.message : "Failed to load brands")
    }
  }

  useEffect(() => {
    fetchModels()
    fetchBrands()
  }, [])

  const getBrandName = (brandId: number) => {
    return brands.find((b) => b.id === brandId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ 
      name: "", 
      brandId: brands[0]?.id || 0 
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Model) => {
    setEditingItem(item)
    setFormData({ 
      name: item.name, 
      brandId: item.brandId 
    })
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
        // Update existing model
        const response = await fetch(`https://localhost:44306/api/Models/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: editingItem.id,
            name: formData.name.trim(),
            brandId: formData.brandId
          })
        })

        if (!response.ok) {
          throw new Error("Failed to update model")
        }
      } else {
        // Create new model
        const response = await fetch("https://localhost:44306/api/Models", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            brandId: formData.brandId
          })
        })

        if (!response.ok) {
          throw new Error("Failed to create model")
        }
      }

      // Refresh the data
      await fetchModels()
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving model:", err)
      setError(err instanceof Error ? err.message : "Failed to save model")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://localhost:44306/api/Models/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      // Refresh the data
      await fetchModels()
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting model:", err)
      setError(err instanceof Error ? err.message : "Failed to delete model")
    }
  }

  // Retry function for error state
  const handleRetry = () => {
    setError(null)
    fetchModels()
    fetchBrands()
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Models" }]} />

        <h1 className="text-3xl font-bold">Models</h1>

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
                header: "Brand",
                accessor: "brandId",
                render: (brandId) => getBrandName(brandId),
              },
              {
                header: "Actions",
                accessor: "id",
                render: (id, row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row as Model)}>
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
            title="Models"
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
            <p>Are you sure you want to delete this model?</p>
          </Modal>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Edit Model" : "Add Model"}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name.trim() || formData.brandId === 0}>
                {editingItem ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., iPhone 15 Pro"
              />
            </div>
            <div>
              <Label htmlFor="brandId">Brand</Label>
              <select
                id="brandId"
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value={0}>Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}