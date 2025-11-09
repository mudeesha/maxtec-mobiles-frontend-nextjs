"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getProducts, addProduct, type Product, getModels, type Model } from "@/lib/admin-store"

export default function StaffProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    modelId: 1,
    price: 0,
    stockQuantity: 0,
    attributeValueIds: [] as number[],
  })

  useEffect(() => {
    setItems(getProducts())
    setModels(getModels())
  }, [])

  const getModelName = (modelId: number) => {
    return models.find((m) => m.id === modelId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setFormData({
      modelId: models[0]?.id || 1,
      price: 0,
      stockQuantity: 0,
      attributeValueIds: [],
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.price || !formData.stockQuantity) return

    addProduct({
      ...formData,
      images: [],
    })
    setItems(getProducts())
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/staff/dashboard" }, { label: "Products" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Staff View - Add Only</p>
            <p>You can add new products but cannot edit or delete existing ones.</p>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Model", accessor: "modelId", render: (modelId) => getModelName(modelId) },
            { header: "Price", accessor: "price", render: (price) => `$${price.toFixed(2)}` },
            { header: "Stock", accessor: "stockQuantity" },
          ]}
          data={items}
          title="Products"
          onAddClick={handleAdd}
        />

        {/* Add Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Product"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Create</Button>
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
