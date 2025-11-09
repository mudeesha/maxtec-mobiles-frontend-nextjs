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
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
  getModels,
  type Model,
  getAttributeValues,
  type AttributeValue,
} from "@/lib/admin-store"

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    modelId: 1,
    price: 0,
    stockQuantity: 0,
    attributeValueIds: [] as number[],
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    setItems(getProducts())
    setModels(getModels())
    setAttributeValues(getAttributeValues())
  }, [])

  const getModelName = (modelId: number) => {
    return models.find((m) => m.id === modelId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      modelId: models[0]?.id || 1,
      price: 0,
      stockQuantity: 0,
      attributeValueIds: [],
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Product) => {
    setEditingItem(item)
    setFormData({
      modelId: item.modelId,
      price: item.price,
      stockQuantity: item.stockQuantity,
      attributeValueIds: item.attributeValueIds,
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.price || !formData.stockQuantity) return

    if (editingItem) {
      updateProduct(editingItem.id, {
        ...formData,
        images: editingItem.images,
      })
    } else {
      addProduct({
        ...formData,
        images: [],
      })
    }
    setItems(getProducts())
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    deleteProduct(id)
    setItems(getProducts())
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Products" }]} />

        <h1 className="text-3xl font-bold">Products</h1>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Model", accessor: "modelId", render: (modelId) => getModelName(modelId) },
            { header: "Price", accessor: "price", render: (price) => `$${price.toFixed(2)}` },
            { header: "Stock", accessor: "stockQuantity" },
            {
              header: "Actions",
              accessor: "id",
              render: (id, row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(row as Product)}>
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
          title="Products"
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
            <p>Are you sure you want to delete this product?</p>
          </Modal>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Edit Product" : "Add Product"}
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
              <Label htmlFor="modelId">Model</Label>
              <select
                id="modelId"
                value={formData.modelId}
                onChange={(e) => setFormData({ ...formData, modelId: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number.parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
