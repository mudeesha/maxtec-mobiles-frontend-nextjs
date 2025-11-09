"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit } from "lucide-react"
import {
  getAttributeValues,
  addAttributeValue,
  deleteAttributeValue,
  updateAttributeValue,
  type AttributeValue,
  getAttributeTypes,
  type AttributeType,
} from "@/lib/admin-store"

export default function AttributeValuesPage() {
  const [items, setItems] = useState<AttributeValue[]>([])
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ attributeTypeId: 1, values: "" })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    setItems(getAttributeValues())
    setAttributeTypes(getAttributeTypes())
  }, [])

  const getTypeName = (typeId: number) => {
    return attributeTypes.find((t) => t.id === typeId)?.name || "Unknown"
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ attributeTypeId: attributeTypes[0]?.id || 1, values: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (item: AttributeValue) => {
    setEditingId(item.id)
    setFormData({ attributeTypeId: item.attributeTypeId, values: item.value })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    const valuesList = formData.values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0)

    if (valuesList.length === 0) return

    if (editingId !== null) {
      updateAttributeValue(editingId, formData.attributeTypeId, valuesList[0])
    } else {
      addAttributeValue(formData.attributeTypeId, valuesList)
    }

    setItems(getAttributeValues())
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    deleteAttributeValue(id)
    setItems(getAttributeValues())
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Attribute Values" }]} />

        <h1 className="text-3xl font-bold">Attribute Values</h1>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Type", accessor: "attributeTypeId", render: (typeId) => getTypeName(typeId) },
            { header: "Value", accessor: "value" },
            {
              header: "Actions",
              accessor: "id",
              render: (id) => {
                const item = items.find((i) => i.id === id)
                return (
                  <div className="flex gap-2">
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
          title="Attribute Values"
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
            <p className="text-foreground">Are you sure you want to delete this attribute value?</p>
          </Modal>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Edit Attribute Value" : "Add Attribute Values"}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingId ? "Update" : "Create"}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typeId" className="font-medium">
                Attribute Type
              </Label>
              <select
                id="typeId"
                value={formData.attributeTypeId}
                onChange={(e) => setFormData({ ...formData, attributeTypeId: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {attributeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="values" className="font-medium">
                Value{!editingId && "s (comma-separated)"}
              </Label>
              <Input
                id="values"
                value={formData.values}
                onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                placeholder={editingId ? "e.g., 128GB" : "e.g., 128GB, 256GB, 512GB"}
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
