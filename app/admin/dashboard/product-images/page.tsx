"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { DataTable } from "@/components/common/data-table"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ZoomIn, ZoomOut } from "lucide-react"
import { ImagePreviewModal } from "@/components/common/image-preview-modal"
import { 
  Trash2, Edit2, AlertCircle, RefreshCw, Loader2,
  Check, X, ChevronsUpDown, Image as ImageIcon, Star, StarOff
} from "lucide-react"
import { toast } from "sonner"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Define interfaces based on your API response
export interface ProductAttribute {
  id: number
  type: string
  value: string
}

export interface ProductImageAssignment {
  productId: number
  productImageId: number
  isDefault: boolean
}

export interface ProductImage {
  id: number
  imageUrl: string
  productIds: number[]
  assignments?: ProductImageAssignment[]
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
}

const API_BASE_URL = "https://localhost:44306/api"

export default function ProductImagesPage() {
  const [items, setItems] = useState<ProductImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProductImage | null>(null)
  const [formData, setFormData] = useState<{
    imageUrl: string
    productAssignments: Array<{productId: number; isDefault: boolean}>
  }>({
    imageUrl: "",
    productAssignments: [],
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  })

  // Fetch product images from API
  const fetchProductImages = async (pageNumber = 1, pageSize = 10) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(
        `${API_BASE_URL}/ProductImage?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      )

      if (!response.ok) throw new Error(`Failed to fetch product images: ${response.status}`)

      const data = await response.json()
      
      // Fetch assignments for each image
      const imagesWithAssignments = await Promise.all(
        (data.data || []).map(async (image: any) => {
          const assignments = await fetchAssignmentsForImage(image.id)
          return {
            id: image.id,
            imageUrl: image.imageUrl,
            productIds: assignments.map(a => a.productId),
            assignments: assignments,
          }
        })
      )
      
      setItems(imagesWithAssignments)
      setPagination({
        currentPage: data.pagination?.pageNumber || 1,
        pageSize: data.pagination?.pageSize || 10,
        totalCount: data.pagination?.totalCount || 0,
        totalPages: data.pagination?.totalPages || 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product images")
      toast.error("Failed to load product images")
    } finally {
      setLoading(false)
    }
  }

  // Fetch product assignments for a specific image
  const fetchAssignmentsForImage = async (imageId: number): Promise<ProductImageAssignment[]> => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return []

      // Use the new assignments endpoint
      const response = await fetch(
        `${API_BASE_URL}/ProductImage/${imageId}/assignments`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      )

      if (!response.ok) return []
      const data = await response.json()
      
      // Handle response from /assignments endpoint
      if (Array.isArray(data)) {
        return data.map((assignment: any) => ({
          productId: assignment.productId,
          productImageId: imageId,
          isDefault: assignment.isDefault || false
        }))
      }
      
      return []
    } catch (err) {
      console.error(`Error fetching assignments for image ${imageId}:`, err)
      return []
    }
  }

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/Products?pageNumber=1&pageSize=100`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })

      if (!response.ok) return

      const data = await response.json()
      if (data.items && Array.isArray(data.items)) {
        setProducts(data.items)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await fetchProductImages()
      await fetchProducts()
    }
    initializeData()
  }, [])

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchProductImages(pageNumber, pagination.pageSize)
    }
  }

  // Format product display text
  const getProductDisplayText = (product: Product): string => {
    if (!product) return ""
    
    const attributesText = product.attributes
      .map(attr => `${attr.value}`)
      .filter(value => value && value.trim() !== "")
      .join(" ")
    
    const parts = [product.brandName, product.modelName]
    if (attributesText) parts.push(attributesText)
    
    return parts.join(" ")
  }

  // Get product display with star icons (NEW IMPROVED VERSION)
  const getProductDisplayNames = (image: ProductImage) => {
    if (!image.assignments || image.assignments.length === 0) {
      return <span className="text-sm text-muted-foreground">No products</span>
    }
    
    return (
      <div className="space-y-1">
        {image.assignments.map((assignment) => {
          const product = products.find(p => p.id === assignment.productId)
          if (!product) return null
          
          const productName = getProductDisplayText(product)
          
          return (
            <div key={assignment.productId} className="flex items-center gap-2">
              <span className="text-sm truncate">{productName}</span>
              {assignment.isDefault ? (
                <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
              ) : (
                <StarOff className="h-3 w-3 text-gray-400 flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      imageUrl: "",
      productAssignments: [],
    })
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleEdit = async (item: ProductImage) => {
    try {
      setEditingItem(item)
      
      // Get assignments for this image
      const assignments = await fetchAssignmentsForImage(item.id)
      
      setFormData({
        imageUrl: item.imageUrl,
        productAssignments: assignments.map(a => ({
          productId: a.productId,
          isDefault: a.isDefault
        }))
      })
      setModalError(null)
      setIsModalOpen(true)
    } catch (err) {
      console.error("Error loading assignments:", err)
      setFormData({
        imageUrl: item.imageUrl,
        productAssignments: []
      })
      setModalError(null)
      setIsModalOpen(true)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setModalError(null)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload JPEG, PNG, GIF, or WebP")
      }

      const objectUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        imageUrl: objectUrl
      }))
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to load image")
    }
  }

  const toggleProductSelection = (productId: number) => {
    setFormData(prev => {
      const existingAssignment = prev.productAssignments.find(a => a.productId === productId)
      
      if (existingAssignment) {
        // Remove product
        return {
          ...prev,
          productAssignments: prev.productAssignments.filter(a => a.productId !== productId)
        }
      } else {
        // Add product with default = false
        return {
          ...prev,
          productAssignments: [
            ...prev.productAssignments,
            { productId, isDefault: false }
          ]
        }
      }
    })
  }

  const toggleDefaultForProduct = (productId: number) => {
    setFormData(prev => ({
      ...prev,
      productAssignments: prev.productAssignments.map(assignment => 
        assignment.productId === productId 
          ? { ...assignment, isDefault: !assignment.isDefault }
          : assignment
      )
    }))
  }

  const isProductSelected = (productId: number) => {
    return formData.productAssignments.some(a => a.productId === productId)
  }

  const isDefaultForSelectedProduct = (productId: number) => {
    const assignment = formData.productAssignments.find(a => a.productId === productId)
    return assignment?.isDefault || false
  }

  const handleSave = async () => {
    setModalError(null)
    
    if (!formData.imageUrl.trim()) {
      setModalError("Image URL is required")
      return
    }

    if (formData.productAssignments.length === 0) {
      setModalError("Please select at least one product")
      return
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      // Payload matches the new backend DTO structure
      const productImageData = {
        imageUrl: formData.imageUrl,
        productAssignments: formData.productAssignments.map(a => ({
          productId: a.productId,
          isDefault: a.isDefault
        }))
      };

      const url = editingItem 
        ? `${API_BASE_URL}/ProductImage/${editingItem.id}`
        : `${API_BASE_URL}/ProductImage`
      
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productImageData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Failed to ${editingItem ? 'update' : 'create'} product image`)
      }

      toast.success(`Product image ${editingItem ? 'updated' : 'created'} successfully`)
      await fetchProductImages(pagination.currentPage, pagination.pageSize)
      setIsModalOpen(false)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save product image"
      setModalError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await fetch(
        `${API_BASE_URL}/ProductImage/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      )

      if (!response.ok) throw new Error("Failed to delete product image")

      toast.success("Product image deleted successfully")
      await fetchProductImages(pagination.currentPage, pagination.pageSize)
      setDeleteConfirm(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product image")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    fetchProductImages(pagination.currentPage, pagination.pageSize)
    fetchProducts()
  }

  const handleRefresh = () => {
    fetchProductImages(pagination.currentPage, pagination.pageSize)
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl)
  }

  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Product Images" }]} />

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Product Images</h1>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>Retry</Button>
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
                header: "Image",
                accessor: "imageUrl",
                render: (url) => (
                  <button
                    onClick={() => openImagePreview(url)}
                    className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt="Product"
                      className="w-12 h-12 rounded-lg object-cover border border-border cursor-pointer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                  </button>
                ),
              },
              {
                header: "Products",
                accessor: "id",
                render: (id) => {
                  const item = items.find((i) => i.id === id)
                  return item ? getProductDisplayNames(item) : "None"
                },
              },
              {
                header: "Actions",
                accessor: "id",
                render: (id) => {
                  const item = items.find((i) => i.id === id)
                  return (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => item && handleEdit(item)}
                        disabled={isSubmitting}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setDeleteConfirm(id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                },
              },
            ]}
            data={items}
            title="Product Images"
            onAddClick={handleAdd}
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              onPageChange: handlePageChange
            }}
          />
        )}

        <ImagePreviewModal
          imageUrl={previewImage || ""}
          isOpen={previewImage !== null}
          onClose={closeImagePreview}
        />

        {deleteConfirm !== null && (
          <Modal
            isOpen={true}
            onClose={() => setDeleteConfirm(null)}
            title="Confirm Delete"
            footer={
              <>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Delete
                </Button>
              </>
            }
          >
            <p className="text-foreground">Are you sure you want to delete this product image?</p>
          </Modal>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => !isSubmitting && setIsModalOpen(false)}
          title={editingItem ? "Edit Product Image" : "Add Product Image"}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting || !formData.imageUrl || formData.productAssignments.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {editingItem ? "Updating..." : "Creating..."}
                  </>
                ) : editingItem ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            {modalError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive text-sm">{modalError}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="font-medium text-sm">Product Image</Label>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/50">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="imageFile" className="block text-sm font-medium mb-2">
                    Upload Image
                  </Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer text-sm"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-sm">Select Products</Label>
              
              {formData.productAssignments.length > 0 && (
                <div className="space-y-2 mb-3 p-3 border rounded-lg bg-secondary/30">
                  {formData.productAssignments.map((assignment) => {
                    const product = products.find(p => p.id === assignment.productId)
                    if (!product) return null
                    
                    return (
                      <div
                        key={assignment.productId}
                        className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getProductDisplayText(product)}</span>
                          {assignment.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                              <Star className="h-3 w-3" />
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDefaultForProduct(assignment.productId)}
                            className="h-8 w-8 p-0"
                            disabled={isSubmitting}
                          >
                            {assignment.isDefault ? (
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProductSelection(assignment.productId)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between"
                    disabled={isSubmitting}
                  >
                    {formData.productAssignments.length > 0
                      ? `${formData.productAssignments.length} product(s) selected`
                      : "Select products..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => {
                          const isSelected = isProductSelected(product.id)
                          return (
                            <CommandItem
                              key={product.id}
                              onSelect={() => toggleProductSelection(product.id)}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "h-4 w-4 rounded border flex items-center justify-center",
                                  isSelected ? "bg-primary border-primary" : "border-border"
                                )}>
                                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                </div>
                                <span>{getProductDisplayText(product)}</span>
                              </div>
                              {isSelected && isDefaultForSelectedProduct(product.id) && (
                                <Star className="h-4 w-4 text-amber-500" />
                              )}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500" />
                  <span>Click the star icon to set as default for a product</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}