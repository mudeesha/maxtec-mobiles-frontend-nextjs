"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, X, Plus } from "lucide-react"

// Define interfaces based on your API response
export interface AttributeType {
  id: number
  name: string
}

export interface AttributeValue {
  id: number
  value: string
}

export interface ApiResponse {
  attributeTypeId: number
  attributeTypeName: string
  attributeValues: AttributeValue[]
}

export default function AttributeValuesPage() {
  const [items, setItems] = useState<ApiResponse[]>([])
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ 
    attributeTypeId: 0, 
    values: [""]
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch attribute values from backend
  const fetchAttributeValues = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://localhost:44306/api/AttributeValues", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch attribute values: ${response.status}`)
      }

      const data: ApiResponse[] = await response.json()
      console.log("API Data:", data)
      setItems(data)
    } catch (err) {
      console.error("Error fetching attribute values:", err)
      setError(err instanceof Error ? err.message : "Failed to load attribute values")
    } finally {
      setLoading(false)
    }
  }

  // Fetch attribute types from backend
  const fetchAttributeTypes = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://localhost:44306/api/AttributeTypes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch attribute types")
      }

      const data: AttributeType[] = await response.json()
      setAttributeTypes(data)
      
      // Set default attribute type ID for form
      if (data.length > 0 && formData.attributeTypeId === 0) {
        setFormData(prev => ({ ...prev, attributeTypeId: data[0].id }))
      }
    } catch (err) {
      console.error("Error fetching attribute types:", err)
      setError(err instanceof Error ? err.message : "Failed to load attribute types")
    }
  }

  useEffect(() => {
    fetchAttributeValues()
    fetchAttributeTypes()
  }, [])

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ 
      attributeTypeId: attributeTypes[0]?.id || 0, 
      values: [""]
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item: ApiResponse) => {
    console.log("Editing item:", item)
    setEditingId(item.attributeTypeId)
    
    // Set existing values for editing
    const existingValues = item.attributeValues.map(av => av.value)
    setFormData({ 
      attributeTypeId: item.attributeTypeId, 
      values: existingValues.length > 0 ? existingValues : [""]
    })
    setIsModalOpen(true)
  }

  // Add new value input field
  const addValueField = () => {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, ""]
    }))
  }

  // Remove value input field
  const removeValueField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }))
  }

  // Update specific value
  const updateValue = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }))
  }

  const handleSave = async () => {
    try {
      // Filter out empty values and trim
      const validValues = formData.values
        .map(v => v.trim())
        .filter(v => v.length > 0)

      if (validValues.length === 0) {
        setError("Please enter at least one value")
        return
      }

      if (formData.attributeTypeId === 0) {
        setError("Please select an attribute type")
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (editingId !== null) {
        // For editing, we need to handle updates differently
        // Since we're editing an entire attribute type's values
        // We'll delete existing values and create new ones
        const existingItem = items.find(item => item.attributeTypeId === editingId)
        if (existingItem) {
          // Delete existing values
          for (const value of existingItem.attributeValues) {
            await fetch(`https://localhost:44306/api/AttributeValues/${value.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            })
          }
        }

        // Create new values
        const response = await fetch("https://localhost:44306/api/AttributeValues/bulk", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            attributeTypeId: formData.attributeTypeId,
            values: validValues
          })
        })

        if (!response.ok) {
          throw new Error("Failed to update attribute values")
        }
      } else {
        // Create multiple attribute values
        const response = await fetch("https://localhost:44306/api/AttributeValues/bulk", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            attributeTypeId: formData.attributeTypeId,
            values: validValues
          })
        })

        if (!response.ok) {
          throw new Error("Failed to create attribute values")
        }
      }

      // Refresh data
      await fetchAttributeValues()
      setIsModalOpen(false)
      setError(null)
    } catch (err) {
      console.error("Error saving attribute values:", err)
      setError(err instanceof Error ? err.message : "Failed to save attribute values")
    }
  }

  const handleDelete = async (attributeTypeId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const item = items.find(item => item.attributeTypeId === attributeTypeId)
      if (!item) {
        throw new Error("Item not found")
      }

      // Delete all values for this attribute type
      for (const value of item.attributeValues) {
        const response = await fetch(`https://localhost:44306/api/AttributeValues/${value.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })

        if (!response.ok) {
          throw new Error("Failed to delete attribute value")
        }
      }

      // Refresh data
      await fetchAttributeValues()
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting attribute values:", err)
      setError(err instanceof Error ? err.message : "Failed to delete attribute values")
    }
  }

  // Retry function for error state
  const handleRetry = () => {
    setError(null)
    fetchAttributeValues()
    fetchAttributeTypes()
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Attribute Values" }]} />

        <h1 className="text-3xl font-bold">Attribute Values</h1>

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
              { header: "Type ID", accessor: "attributeTypeId" },
              { 
                header: "Type Name", 
                accessor: "attributeTypeName"
              },
              { 
                header: "Values", 
                accessor: "attributeValues",
                render: (values: AttributeValue[]) => 
                  values.map(v => v.value).join(", ") || "No values"
              },
              {
                header: "Actions",
                accessor: "attributeTypeId",
                render: (attributeTypeId) => {
                  const item = items.find((i) => i.attributeTypeId === attributeTypeId)
                  return (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => item && handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setDeleteConfirm(attributeTypeId)}
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
            <p className="text-foreground">Are you sure you want to delete all values for this attribute type?</p>
          </Modal>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Edit Attribute Values" : "Add Attribute Values"}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingId ? "Update" : "Create"}
              </Button>
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
                disabled={editingId !== null} // Disable when editing
              >
                <option value={0}>Select Attribute Type</option>
                {attributeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium">
                  Values (Multiple)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addValueField}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Value
                </Button>
              </div>

              {formData.values.map((value, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={value}
                    onChange={(e) => updateValue(index, e.target.value)}
                    placeholder="e.g., 4GB"
                    className="flex-1"
                  />
                  {formData.values.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeValueField(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <p className="text-sm text-muted-foreground">
                Add multiple values for the selected attribute type
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}