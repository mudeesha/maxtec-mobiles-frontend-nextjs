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
  getAttributeTypes,
  addAttributeType,
  updateAttributeType,
  deleteAttributeType,
  type AttributeType,
} from "@/lib/admin-store"

export default function AttributeTypesPage() {
  const [items, setItems] = useState<AttributeType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AttributeType | null>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    setItems(getAttributeTypes())
  }, [])

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (item: AttributeType) => {
    setEditingItem(item)
    setFormData({ name: item.name })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    if (editingItem) {
      updateAttributeType(editingItem.id, formData.name)
    } else {
      addAttributeType(formData.name)
    }
    setItems(getAttributeTypes())
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    deleteAttributeType(id)
    setItems(getAttributeTypes())
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Attribute Types" }]} />

        <h1 className="text-3xl font-bold">Attribute Types</h1>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Name", accessor: "name" },
            {
              header: "Actions",
              accessor: "id",
              render: (id, row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(row as AttributeType)}>
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
          title="Attribute Types"
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
            <p>Are you sure you want to delete this attribute type?</p>
          </Modal>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Edit Attribute Type" : "Add Attribute Type"}
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
