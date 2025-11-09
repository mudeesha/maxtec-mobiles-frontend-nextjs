export interface AttributeType {
  id: number
  name: string
}

export interface AttributeValue {
  id: number
  attributeTypeId: number
  value: string
}

export interface Brand {
  id: number
  name: string
}

export interface Model {
  id: number
  name: string
  brandId: number
}

export interface ProductImage {
  id: number
  imageUrl: string
  productIds: number[]
  isDefault: boolean
}

export interface Product {
  id: number
  modelId: number
  price: number
  stockQuantity: number
  attributeValueIds: number[]
  images: ProductImage[]
}

// Mock data
export const attributeTypes: AttributeType[] = [
  { id: 1, name: "Storage" },
  { id: 2, name: "Color" },
  { id: 3, name: "RAM" },
]

export const attributeValues: AttributeValue[] = [
  { id: 1, attributeTypeId: 1, value: "128GB" },
  { id: 2, attributeTypeId: 1, value: "256GB" },
  { id: 3, attributeTypeId: 1, value: "512GB" },
  { id: 4, attributeTypeId: 2, value: "Black" },
  { id: 5, attributeTypeId: 2, value: "Silver" },
  { id: 6, attributeTypeId: 2, value: "Gold" },
  { id: 7, attributeTypeId: 3, value: "8GB" },
  { id: 8, attributeTypeId: 3, value: "12GB" },
  { id: 9, attributeTypeId: 3, value: "16GB" },
]

export const brands: Brand[] = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Google" },
]

export const models: Model[] = [
  { id: 1, name: "iPhone 15 Pro", brandId: 1 },
  { id: 2, name: "iPhone 15", brandId: 1 },
  { id: 3, name: "Galaxy S24 Ultra", brandId: 2 },
  { id: 4, name: "Galaxy S24", brandId: 2 },
  { id: 5, name: "Pixel 9 Pro", brandId: 3 },
  { id: 6, name: "Pixel 9", brandId: 3 },
]

export const productImages: ProductImage[] = [
  { id: 1, imageUrl: "/iphone-15-pro-black.jpg", productIds: [1, 2, 3], isDefault: true },
  { id: 2, imageUrl: "/iphone-15-pro-silver.jpg", productIds: [1, 2, 3], isDefault: false },
  { id: 3, imageUrl: "/galaxy-s24-ultra-black.jpg", productIds: [4, 5, 6], isDefault: true },
  { id: 4, imageUrl: "/galaxy-s24-ultra-gold.jpg", productIds: [4, 5, 6], isDefault: false },
  { id: 5, imageUrl: "/pixel-9-pro-black.jpg", productIds: [7, 8, 9], isDefault: true },
  { id: 6, imageUrl: "/pixel-9-black.jpg", productIds: [10, 11, 12], isDefault: true },
]

export const products: Product[] = [
  {
    id: 1,
    modelId: 1,
    price: 1199,
    stockQuantity: 50,
    attributeValueIds: [1, 4, 7],
    images: productImages.filter((img) => img.productIds.includes(1)),
  },
  {
    id: 2,
    modelId: 1,
    price: 1199,
    stockQuantity: 45,
    attributeValueIds: [1, 5, 7],
    images: productImages.filter((img) => img.productIds.includes(2)),
  },
  {
    id: 3,
    modelId: 1,
    price: 1299,
    stockQuantity: 30,
    attributeValueIds: [2, 4, 8],
    images: productImages.filter((img) => img.productIds.includes(3)),
  },
  {
    id: 4,
    modelId: 3,
    price: 1299,
    stockQuantity: 40,
    attributeValueIds: [2, 4, 8],
    images: productImages.filter((img) => img.productIds.includes(4)),
  },
  {
    id: 5,
    modelId: 3,
    price: 1299,
    stockQuantity: 35,
    attributeValueIds: [2, 6, 8],
    images: productImages.filter((img) => img.productIds.includes(5)),
  },
  {
    id: 6,
    modelId: 3,
    price: 1399,
    stockQuantity: 25,
    attributeValueIds: [3, 4, 9],
    images: productImages.filter((img) => img.productIds.includes(6)),
  },
  {
    id: 7,
    modelId: 5,
    price: 999,
    stockQuantity: 60,
    attributeValueIds: [2, 4, 8],
    images: productImages.filter((img) => img.productIds.includes(7)),
  },
  {
    id: 8,
    modelId: 5,
    price: 999,
    stockQuantity: 55,
    attributeValueIds: [2, 5, 8],
    images: productImages.filter((img) => img.productIds.includes(8)),
  },
  {
    id: 9,
    modelId: 5,
    price: 1099,
    stockQuantity: 40,
    attributeValueIds: [3, 4, 9],
    images: productImages.filter((img) => img.productIds.includes(9)),
  },
  {
    id: 10,
    modelId: 6,
    price: 799,
    stockQuantity: 70,
    attributeValueIds: [1, 4, 7],
    images: productImages.filter((img) => img.productIds.includes(10)),
  },
  {
    id: 11,
    modelId: 6,
    price: 799,
    stockQuantity: 65,
    attributeValueIds: [1, 5, 7],
    images: productImages.filter((img) => img.productIds.includes(11)),
  },
  {
    id: 12,
    modelId: 6,
    price: 899,
    stockQuantity: 50,
    attributeValueIds: [2, 6, 8],
    images: productImages.filter((img) => img.productIds.includes(12)),
  },
]

export function getProductName(product: Product): string {
  const model = models.find((m) => m.id === product.modelId)
  return model?.name || "Unknown Product"
}

export function getBrandName(product: Product): string {
  const model = models.find((m) => m.id === product.modelId)
  const brand = brands.find((b) => b.id === model?.brandId)
  return brand?.name || "Unknown Brand"
}

export function getAttributeValuesText(product: Product): string {
  return product.attributeValueIds
    .map((id) => attributeValues.find((av) => av.id === id)?.value)
    .filter(Boolean)
    .join(", ")
}

export function getDefaultImage(product: Product): string {
  return (
    product.images.find((img) => img.isDefault)?.imageUrl || product.images[0]?.imageUrl || "/diverse-products-still-life.png"
  )
}
