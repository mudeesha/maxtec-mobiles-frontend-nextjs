"use client"

import type React from "react"

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
  getProductImages,
  addProductImage,
  deleteProductImage,
  updateProductImage,
  type ProductImage,
  getProducts,
  type Product,
} from "@/lib/admin-store"

export default function ProductImagesPage() {
  const [items, setItems] = useState<ProductImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    imageUrl: "",
    productId: "",
    isDefault: false,
  })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    setItems(getProductImages())
    setProducts(getProducts())
  }, [])

  const handleAdd = () => {
    setEditingId(null)
    setImagePreview("")
    setFormData({ imageUrl: "", productId: "", isDefault: false })
    setIsModalOpen(true)
  }

  const handleEdit = (item: ProductImage) => {
    setEditingId(item.id)
    setImagePreview(item.imageUrl)
    setFormData({
      imageUrl: item.imageUrl,
      productId: item.productIds.length > 0 ? String(item.productIds[0]) : "",
      isDefault: item.isDefault,
    })
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setImagePreview(imageUrl)
        setFormData({ ...formData, imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!formData.imageUrl.trim() || !formData.productId) return

    const productId = Number.parseInt(formData.productId)
    if (isNaN(productId)) return

    if (editingId !== null) {
      updateProductImage(editingId, formData.imageUrl, [productId], formData.isDefault)
    } else {
      addProductImage(formData.imageUrl, [productId], formData.isDefault)
    }

    setItems(getProductImages())
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    deleteProductImage(id)
    setItems(getProductImages())
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Product Images" }]} />

        <h1 className="text-3xl font-bold">Product Images</h1>

        <DataTable
          columns={[
            { header: "ID", accessor: "id" },
            {
              header: "Image",
              accessor: "imageUrl",
              render: (url) => (
                <img
                  src={url || "/placeholder.svg"}
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover border border-border"
                />
              ),
            },
            {
              header: "Products",
              accessor: "productIds",
              render: (ids: number[]) => {
                const productNames = ids.map((id) => {
                  const product = products.find((p) => p.id === id)
                  return product?.name || `Product ${id}`
                })
                return productNames.length > 0 ? productNames.join(", ") : "None"
              },
            },
            {
              header: "Default",
              accessor: "isDefault",
              render: (isDefault) => (isDefault ? "Yes" : "No"),
            },
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
          title="Product Images"
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
            <p className="text-foreground">Are you sure you want to delete this product image?</p>
          </Modal>
        )}

        {/* Add/Edit Modal - Improved form layout with better grid alignment */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Edit Product Image" : "Add Product Image"}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingId ? "Update" : "Create"}</Button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="font-medium text-sm">Product Image</Label>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/50">
                      <span className="text-xs text-muted-foreground">No image</span>
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
                  />
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="imageUrl" className="font-medium text-sm">
                Or Enter Image URL
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="text-sm"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="productId" className="font-medium text-sm">
                Select Product
              </Label>
              <select
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={String(product.id)}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="cursor-pointer"
              />
              <Label htmlFor="isDefault" className="cursor-pointer font-medium text-sm">
                Set as default image
              </Label>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
