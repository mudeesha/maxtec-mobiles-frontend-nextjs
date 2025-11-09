"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getAttributeValues,
  addAttributeValue,
  type AttributeValue,
  getAttributeTypes,
  type AttributeType,
} from "@/lib/admin-store"

export default function StaffAttributeValuesPage() {
  const [items, setItems] = useState<AttributeValue[]>([])
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ attributeTypeId: 1, values: "" })

  useEffect(() => {
    setItems(getAttributeValues())
    setAttributeTypes(getAttributeTypes())
  }, [])

  const getTypeName = (typeId: number) => {
    return attributeTypes.find((t) => t.id === typeId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setFormData({ attributeTypeId: attributeTypes[0]?.id || 1, values: "" })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    const valuesList = formData.values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0)

    if (valuesList.length === 0) return

    addAttributeValue(formData.attributeTypeId, valuesList)
    setItems(getAttributeValues())
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/staff/dashboard" }, { label: "Attribute Values" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Attribute Values</h1>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Staff View - Add Only</p>
            <p>You can add new attribute values but cannot edit or delete existing ones.</p>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Type", accessor: "attributeTypeId", render: (typeId) => getTypeName(typeId) },
            { header: "Value", accessor: "value" },
          ]}
          data={items}
          title="Attribute Values"
          onAddClick={handleAdd}
        />

        {/* Add Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Attribute Values"
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
              <Label htmlFor="typeId">Attribute Type</Label>
              <select
                id="typeId"
                value={formData.attributeTypeId}
                onChange={(e) => setFormData({ ...formData, attributeTypeId: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                {attributeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="values">Values (comma-separated)</Label>
              <Input
                id="values"
                value={formData.values}
                onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                placeholder="e.g., 128GB, 256GB, 512GB"
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
