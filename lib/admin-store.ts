// Admin data store with mock data management
import {
  type AttributeType,
  type AttributeValue,
  type Brand,
  type Model,
  type ProductImage,
  type Product,
  attributeTypes,
  attributeValues,
  brands,
  models,
  productImages,
  products,
} from "./mock-data"

// In a real app, these would be API calls
let mockAttributeTypes = [...attributeTypes]
let mockAttributeValues = [...attributeValues]
let mockBrands = [...brands]
let mockModels = [...models]
let mockProductImages = [...productImages]
let mockProducts = [...products]
let mockUsers = [
  { id: 1, name: "John Admin", email: "admin@example.com", role: "admin", status: "active", joinDate: "2024-01-15" },
  { id: 2, name: "Jane Staff", email: "staff@example.com", role: "staff", status: "active", joinDate: "2024-01-20" },
  {
    id: 3,
    name: "Bob Customer",
    email: "customer@example.com",
    role: "customer",
    status: "active",
    joinDate: "2024-02-01",
  },
  {
    id: 4,
    name: "Alice Customer",
    email: "alice@example.com",
    role: "customer",
    status: "inactive",
    joinDate: "2024-01-10",
  },
]

// Attribute Types
export function getAttributeTypes() {
  return mockAttributeTypes
}

export function addAttributeType(name: string) {
  const newItem: AttributeType = {
    id: Math.max(...mockAttributeTypes.map((a) => a.id), 0) + 1,
    name,
  }
  mockAttributeTypes.push(newItem)
  return newItem
}

export function updateAttributeType(id: number, name: string) {
  const item = mockAttributeTypes.find((a) => a.id === id)
  if (item) {
    item.name = name
  }
  return item
}

export function deleteAttributeType(id: number) {
  mockAttributeTypes = mockAttributeTypes.filter((a) => a.id !== id)
}

// Attribute Values
export function getAttributeValues() {
  return mockAttributeValues
}

export function addAttributeValue(attributeTypeId: number, values: string[]) {
  const newItems: AttributeValue[] = values.map((value) => ({
    id: Math.max(...mockAttributeValues.map((a) => a.id), 0) + 1,
    attributeTypeId,
    value,
  }))
  mockAttributeValues.push(...newItems)
  return newItems
}

export function updateAttributeValue(id: number, attributeTypeId: number, value: string) {
  const item = mockAttributeValues.find((a) => a.id === id)
  if (item) {
    item.attributeTypeId = attributeTypeId
    item.value = value
  }
  return item
}

export function deleteAttributeValue(id: number) {
  mockAttributeValues = mockAttributeValues.filter((a) => a.id !== id)
}

// Brands
export function getBrands() {
  return mockBrands
}

export function addBrand(name: string) {
  const newItem: Brand = {
    id: Math.max(...mockBrands.map((b) => b.id), 0) + 1,
    name,
  }
  mockBrands.push(newItem)
  return newItem
}

export function updateBrand(id: number, name: string) {
  const item = mockBrands.find((b) => b.id === id)
  if (item) {
    item.name = name
  }
  return item
}

export function deleteBrand(id: number) {
  mockBrands = mockBrands.filter((b) => b.id !== id)
}

// Models
export function getModels() {
  return mockModels
}

export function addModel(name: string, brandId: number) {
  const newItem: Model = {
    id: Math.max(...mockModels.map((m) => m.id), 0) + 1,
    name,
    brandId,
  }
  mockModels.push(newItem)
  return newItem
}

export function updateModel(id: number, name: string, brandId: number) {
  const item = mockModels.find((m) => m.id === id)
  if (item) {
    item.name = name
    item.brandId = brandId
  }
  return item
}

export function deleteModel(id: number) {
  mockModels = mockModels.filter((m) => m.id !== id)
}

// Products
export function getProducts() {
  return mockProducts
}

export function addProduct(product: Omit<Product, "id">) {
  const newItem: Product = {
    ...product,
    id: Math.max(...mockProducts.map((p) => p.id), 0) + 1,
  }
  mockProducts.push(newItem)
  return newItem
}

export function updateProduct(id: number, updates: Partial<Product>) {
  const item = mockProducts.find((p) => p.id === id)
  if (item) {
    Object.assign(item, updates)
  }
  return item
}

export function deleteProduct(id: number) {
  mockProducts = mockProducts.filter((p) => p.id !== id)
}

// Product Images
export function getProductImages() {
  return mockProductImages
}

export function addProductImage(imageUrl: string, productIds: number[], isDefault: boolean) {
  const newItem: ProductImage = {
    id: Math.max(...mockProductImages.map((p) => p.id), 0) + 1,
    imageUrl,
    productIds,
    isDefault,
  }
  mockProductImages.push(newItem)
  return newItem
}

export function updateProductImage(id: number, imageUrl: string, productIds: number[], isDefault: boolean) {
  const item = mockProductImages.find((p) => p.id === id)
  if (item) {
    item.imageUrl = imageUrl
    item.productIds = productIds
    item.isDefault = isDefault
  }
  return item
}

export function deleteProductImage(id: number) {
  mockProductImages = mockProductImages.filter((p) => p.id !== id)
}

// Users
export type User = (typeof mockUsers)[0]

export function getUsers() {
  return mockUsers
}

export function addUser(name: string, email: string, role: string, status: string) {
  const newItem: User = {
    id: Math.max(...mockUsers.map((u) => u.id), 0) + 1,
    name,
    email,
    role,
    status,
    joinDate: new Date().toISOString().split("T")[0],
  }
  mockUsers.push(newItem)
  return newItem
}

export function updateUser(id: number, name: string, email: string, role: string, status: string) {
  const item = mockUsers.find((u) => u.id === id)
  if (item) {
    item.name = name
    item.email = email
    item.role = role
    item.status = status
  }
  return item
}

export function deleteUser(id: number) {
  mockUsers = mockUsers.filter((u) => u.id !== id)
}
