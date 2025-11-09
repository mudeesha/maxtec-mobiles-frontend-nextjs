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
import { getProductImages, addProductImage, type ProductImage, getProducts, type Product } from "@/lib/admin-store"

export default function StaffProductImagesPage() {
  const [items, setItems] = useState<ProductImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    imageUrl: "",
    productId: "",
    isDefault: false,
  })

  useEffect(() => {
    setItems(getProductImages())
    setProducts(getProducts())
  }, [])

  const handleAdd = () => {
    setImagePreview("")
    setFormData({ imageUrl: "", productId: "", isDefault: false })
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

    addProductImage(formData.imageUrl, [productId], formData.isDefault)
    setItems(getProductImages())
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout requiredRoles={["staff"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/staff/dashboard" }, { label: "Product Images" }]} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Product Images</h1>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-400">
            <p className="font-semibold mb-1">Staff View - Add Only</p>
            <p>You can add new product images but cannot delete existing ones.</p>
          </div>
        </div>

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
          ]}
          data={items}
          title="Product Images"
          onAddClick={handleAdd}
        />

        {/* Add Modal - Updated with file upload and product dropdown */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Product Image"
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Create</Button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="font-medium">Product Image</Label>
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
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="font-medium">
                Or Enter Image URL
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId" className="font-medium">
                Select Product
              </Label>
              <select
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
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
              <Label htmlFor="isDefault" className="cursor-pointer font-medium">
                Set as default image
              </Label>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
