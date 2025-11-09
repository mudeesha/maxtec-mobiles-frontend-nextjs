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
import { getModels, addModel, updateModel, deleteModel, type Model, getBrands, type Brand } from "@/lib/admin-store"

export default function ModelsPage() {
  const [items, setItems] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Model | null>(null)
  const [formData, setFormData] = useState({ name: "", brandId: 1 })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    setItems(getModels())
    setBrands(getBrands())
  }, [])

  const getBrandName = (brandId: number) => {
    return brands.find((b) => b.id === brandId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: "", brandId: brands[0]?.id || 1 })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Model) => {
    setEditingItem(item)
    setFormData({ name: item.name, brandId: item.brandId })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    if (editingItem) {
      updateModel(editingItem.id, formData.name, formData.brandId)
    } else {
      addModel(formData.name, formData.brandId)
    }
    setItems(getModels())
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    deleteModel(id)
    setItems(getModels())
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Models" }]} />

        <h1 className="text-3xl font-bold">Models</h1>

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
              <Button onClick={handleSave}>{editingItem ? "Update" : "Create"}</Button>
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
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
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
