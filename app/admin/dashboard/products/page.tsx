"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit2, Check, AlertCircle } from "lucide-react"

// Define interfaces based on your API response
export interface Model {
  id: number
  name: string
  brandId: number
  brand?: {
    id: number
    name: string
  }
}

export interface AttributeValue {
  id: number
  value: string
  attributeTypeId: number
  attributeTypeName?: string
}

export interface ProductAttribute {
  id: number
  type: string
  value: string
}

export interface Product {
  id: number
  sku: string
  brandId: number
  brandName: string
  modelId: number
  modelName: string
  attributes: ProductAttribute[]
  stockQuantity: number
  price: number
  images: string[]
  defaultImageUrl: string | null
}

export interface ProductApiResponse {
  items: Product[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    modelId: 0,
    price: 0,
    stockQuantity: 0,
    attributeValueIds: [] as number[],
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  // Fetch products from backend API with pagination
  const fetchProducts = async (pageNumber = 1, pageSize = 10) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Add pagination parameters to the URL
      const url = `https://localhost:44306/api/Products?pageNumber=${pageNumber}&pageSize=${pageSize}`
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }

      const data: ProductApiResponse = await response.json()
      setItems(data.items)
      
      // Update pagination state from API response
      setPagination({
        currentPage: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasPreviousPage: data.hasPreviousPage,
        hasNextPage: data.hasNextPage
      })
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  // Fetch models from backend API
  const fetchModels = async () => {
    try {
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
        throw new Error("Failed to fetch models")
      }

      const data: Model[] = await response.json()
      setModels(data)
      
      if (data.length > 0 && formData.modelId === 0) {
        setFormData(prev => ({ ...prev, modelId: data[0].id }))
      }
    } catch (err) {
      console.error("Error fetching models:", err)
      setError(err instanceof Error ? err.message : "Failed to load models")
    }
  }

  // Fetch attribute values from backend API
  const fetchAttributeValues = async () => {
    try {
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
        console.warn("Failed to fetch attribute values")
        return
      }

      const data = await response.json()
      
      // Transform grouped data to flat array
      const flatData: AttributeValue[] = []
      if (Array.isArray(data)) {
        data.forEach((group: any) => {
          if (group.attributeValues && Array.isArray(group.attributeValues)) {
            group.attributeValues.forEach((value: any) => {
              flatData.push({
                id: value.id,
                value: value.value,
                attributeTypeId: group.attributeTypeId,
                attributeTypeName: group.attributeTypeName
              })
            })
          }
        })
      }
      setAttributeValues(flatData)
    } catch (err) {
      console.error("Error fetching attribute values:", err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchModels()
    fetchAttributeValues()
  }, [])

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchProducts(pageNumber, pagination.pageSize)
    }
  }

  // Get model name from product data
  const getModelDisplayName = (product: Product) => {
    return `${product.brandName} ${product.modelName}`
  }

  // Format attributes for display
  const formatAttributes = (attributes: ProductAttribute[]) => {
    return attributes.map(attr => `${attr.type}: ${attr.value}`).join(", ")
  }

  const getAttributeValuesGrouped = () => {
    const grouped: Record<string, AttributeValue[]> = {}
    
    attributeValues.forEach(av => {
      const typeName = av.attributeTypeName || `Type ${av.attributeTypeId}`
      if (!grouped[typeName]) {
        grouped[typeName] = []
      }
      grouped[typeName].push(av)
    })
    
    return grouped
  }

  // Check if selecting a new value would conflict with existing selection
  const canSelectAttributeValue = (attributeValueId: number) => {
    const attributeValue = attributeValues.find(av => av.id === attributeValueId)
    if (!attributeValue) return true
    
    // Check if we already have a value from the same attribute type
    const hasSameType = formData.attributeValueIds.some(id => {
      const existingAv = attributeValues.find(av => av.id === id)
      return existingAv && existingAv.attributeTypeId === attributeValue.attributeTypeId
    })
    
    // If we already have a value from this type, only allow selection if it's the same value
    if (hasSameType) {
      return formData.attributeValueIds.includes(attributeValueId)
    }
    
    return true
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      modelId: models[0]?.id || 0,
      price: 0,
      stockQuantity: 0,
      attributeValueIds: [],
    })
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: Product) => {
    setEditingItem(item)
    setFormData({
      modelId: item.modelId,
      price: item.price,
      stockQuantity: item.stockQuantity,
      attributeValueIds: item.attributes.map(attr => attr.id) || [],
    })
    setModalError(null)
    setIsModalOpen(true)
  }

  const toggleAttributeValue = (id: number) => {
    setModalError(null)
    
    const attributeValue = attributeValues.find(av => av.id === id)
    if (!attributeValue) return
    
    // Check if already selected - then remove it
    if (formData.attributeValueIds.includes(id)) {
      setFormData(prev => ({
        ...prev,
        attributeValueIds: prev.attributeValueIds.filter(valId => valId !== id)
      }))
      return
    }
    
    // Check if we can select this attribute value
    const canSelect = canSelectAttributeValue(id)
    
    if (!canSelect) {
      const typeName = attributeValue.attributeTypeName || `Type ${attributeValue.attributeTypeId}`
      const existingId = formData.attributeValueIds.find(existingId => {
        const existingAv = attributeValues.find(av => av.id === existingId)
        return existingAv?.attributeTypeId === attributeValue.attributeTypeId
      })
      
      const existingValue = existingId ? attributeValues.find(av => av.id === existingId)?.value : ""
      
      setModalError(`Cannot select multiple values for ${typeName}. You already selected "${existingValue}". Please deselect it first.`)
      return
    }
    
    // If we can select it, add it to the list
    setFormData(prev => ({
      ...prev,
      attributeValueIds: [...prev.attributeValueIds, id]
    }))
  }

  const handleSave = async () => {
    setModalError(null)
    
    if (!formData.price || formData.price <= 0) {
      setModalError("Price must be greater than 0")
      return
    }

    if (formData.stockQuantity < 0) {
      setModalError("Stock quantity cannot be negative")
      return
    }

    if (formData.modelId === 0) {
      setModalError("Please select a model")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const productData = {
        modelId: formData.modelId,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        attributeValueIds: formData.attributeValueIds,
      }

      if (editingItem) {
        const response = await fetch(`https://localhost:44306/api/Products/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: editingItem.id,
            ...productData
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          // Try to parse error message from backend
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.message || errorData.title || "Failed to update product")
          } catch {
            throw new Error(errorText || "Failed to update product")
          }
        }
      } else {
        const response = await fetch("https://localhost:44306/api/Products", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          // Try to parse error message from backend
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.message || errorData.title || "Failed to create product")
          } catch {
            throw new Error(errorText || "Failed to create product")
          }
        }
      }

      await fetchProducts(pagination.currentPage, pagination.pageSize)
      setIsModalOpen(false)
      setError(null)
    } catch (err) {
      console.error("Error saving product:", err)
      setModalError(err instanceof Error ? err.message : "Failed to save product")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://localhost:44306/api/Products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      await fetchProducts(pagination.currentPage, pagination.pageSize)
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting product:", err)
      setError(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

  const handleRetry = () => {
    setError(null)
    fetchProducts(pagination.currentPage, pagination.pageSize)
    fetchModels()
    fetchAttributeValues()
  }

  const groupedAttributes = getAttributeValuesGrouped()

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Products" }]} />

        <h1 className="text-3xl font-bold">Products</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{pagination.totalCount}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Current Page</p>
            <p className="text-2xl font-bold">{pagination.currentPage} of {pagination.totalPages}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Page Size</p>
            <p className="text-2xl font-bold">{pagination.pageSize}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Showing</p>
            <p className="text-2xl font-bold">{items.length} items</p>
          </div>
        </div>

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

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={[
              { header: "ID", accessor: "id" },
              { 
                header: "SKU", 
                accessor: "sku"
              },
              { 
                header: "Product", 
                accessor: "modelName",
                render: (_, row) => getModelDisplayName(row as Product)
              },
              { 
                header: "Attributes", 
                accessor: "attributes",
                render: (attributes) => formatAttributes(attributes as ProductAttribute[])
              },
              { 
                header: "Price", 
                accessor: "price", 
                render: (price) => `$${price.toFixed(2)}` 
              },
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
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              onPageChange: handlePageChange
            }}
          />
        )}

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

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setModalError(null)
          }}
          title={editingItem ? "Edit Product" : "Add Product"}
          footer={
            <>
              <Button variant="outline" onClick={() => {
                setIsModalOpen(false)
                setModalError(null)
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!formData.price || formData.price <= 0 || formData.modelId === 0}
              >
                {editingItem ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Modal Error Message */}
            {modalError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive text-sm">{modalError}</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="modelId">Model *</Label>
              <select
                id="modelId"
                value={formData.modelId}
                onChange={(e) => {
                  setFormData({ ...formData, modelId: Number.parseInt(e.target.value) })
                  setModalError(null)
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value={0}>Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.brand?.name ? `${model.brand.name} ${model.name}` : model.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })
                  setModalError(null)
                }}
                placeholder="0.01"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => {
                  setFormData({ ...formData, stockQuantity: Number.parseInt(e.target.value) || 0 })
                  setModalError(null)
                }}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Attribute Values *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select only one value per attribute type (e.g., only one RAM size, one Color)
              </p>
              <div className="space-y-4 max-h-60 overflow-y-auto p-2 border rounded-lg">
                {Object.entries(groupedAttributes).map(([typeName, values]) => {
                  // Find which value is currently selected for this type
                  const selectedId = formData.attributeValueIds.find(id => {
                    const av = attributeValues.find(av => av.id === id)
                    return av?.attributeTypeName === typeName || 
                           av?.attributeTypeId.toString() === typeName.replace("Type ", "")
                  })
                  
                  return (
                    <div key={typeName} className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {typeName} {selectedId && "(Selected)"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {values.map((av) => {
                          const isSelected = formData.attributeValueIds.includes(av.id)
                          const isDisabled = selectedId && selectedId !== av.id
                          
                          return (
                            <Button
                              key={av.id}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleAttributeValue(av.id)}
                              className="flex items-center gap-1"
                              disabled={isDisabled}
                            >
                              {av.value}
                              {isSelected && (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                          )
                        })}
                      </div>
                      {selectedId && (
                        <p className="text-xs text-muted-foreground">
                          Only one {typeName} can be selected. Deselect current to choose another.
                        </p>
                      )}
                    </div>
                  )
                })}
                {Object.keys(groupedAttributes).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No attribute values available
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {formData.attributeValueIds.length} attribute value(s)
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}