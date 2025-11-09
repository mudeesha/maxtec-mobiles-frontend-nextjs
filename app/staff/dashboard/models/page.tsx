"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getModels, addModel, type Model, getBrands, type Brand } from "@/lib/admin-store"

export default function StaffModelsPage() {
  const [items, setItems] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", brandId: 1 })

  useEffect(() => {
    setItems(getModels())
    setBrands(getBrands())
  }, [])

  const getBrandName = (brandId: number) => {
    return brands.find((b) => b.id === brandId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setFormData({ name: "", brandId: brands[0]?.id || 1 })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    addModel(formData.name, formData.brandId)
    setItems(getModels())
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/staff/dashboard" }, { label: "Models" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Models</h1>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Staff View - Add Only</p>
            <p>You can add new models but cannot edit or delete existing ones.</p>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Name", accessor: "name" },
            {
              header: "Brand",
              accessor: "brandId",
              render: (brandId) => getBrandName(brandId),
            },
          ]}
          data={items}
          title="Models"
          onAddClick={handleAdd}
        />

        {/* Add Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Model"
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
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
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
