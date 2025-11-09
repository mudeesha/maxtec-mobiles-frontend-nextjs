// Cart management with localStorage persistence
export interface CartItem {
  productId: number
  quantity: number
  price: number
  name: string
  image: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

const CART_KEY = "ecommerce-cart"

export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0 }
  }
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : { items: [], total: 0 }
}

export function saveCart(cart: Cart): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
}

export function addToCart(item: CartItem): Cart {
  const cart = getCart()
  const existing = cart.items.find((i) => i.productId === item.productId)

  if (existing) {
    existing.quantity += item.quantity
  } else {
    cart.items.push(item)
  }

  calculateTotal(cart)
  saveCart(cart)
  return cart
}

export function removeFromCart(productId: number): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)
  calculateTotal(cart)
  saveCart(cart)
  return cart
}

export function updateQuantity(productId: number, quantity: number): Cart {
  const cart = getCart()
  const item = cart.items.find((i) => i.productId === productId)

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId)
    } else {
      item.quantity = quantity
    }
  }

  calculateTotal(cart)
  saveCart(cart)
  return cart
}

export function clearCart(): Cart {
  const cart: Cart = { items: [], total: 0 }
  saveCart(cart)
  return cart
}

export function calculateTotal(cart: Cart): number {
  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return cart.total
}
