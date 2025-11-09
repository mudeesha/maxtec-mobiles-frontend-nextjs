"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAttributeTypes, addAttributeType, type AttributeType } from "@/lib/admin-store"

export default function StaffAttributeTypesPage() {
  const [items, setItems] = useState<AttributeType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "" })

  useEffect(() => {
    setItems(getAttributeTypes())
  }, [])

  const handleAdd = () => {
    setFormData({ name: "" })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    addAttributeType(formData.name)
    setItems(getAttributeTypes())
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/staff/dashboard" }, { label: "Attribute Types" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Attribute Types</h1>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Staff View - Add Only</p>
            <p>You can add new attribute types but cannot edit or delete existing ones.</p>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Name", accessor: "name" },
          ]}
          data={items}
          title="Attribute Types"
          onAddClick={handleAdd}
        />

        {/* Add Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Attribute Type"
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="e.g., Storage, Color"
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
