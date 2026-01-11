// lib/cart-store.ts - SIMPLE & WORKS LIKE YOUR BRANDS PAGE
const API_URL = 'https://localhost:44306/api';

// Get token function - exactly like your brands page
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// OLD FUNCTIONS - Keep for product modal
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

const CART_KEY = "ecommerce-cart";

// 1. Keep getCart (for localStorage)
export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0 }
  }
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : { items: [], total: 0 }
}

// 2. Keep addToCart (for product modal)
export function addToCart(item: CartItem): Cart {
  // Save to localStorage
  const cart = getCart()
  const existing = cart.items.find((i) => i.productId === item.productId)

  if (existing) {
    existing.quantity += item.quantity
  } else {
    cart.items.push(item)
  }

  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }

  // Try to sync with backend (in background, like your brands page)
  syncToBackend(item.productId, item.quantity);
  
  return cart
}

// 3. Sync function that matches your brands page pattern
async function syncToBackend(productId: number, quantity: number) {
  try {
    const token = getToken();
    if (!token) {
      console.log("No token - cart saved locally only");
      return;
    }

    // EXACTLY like your brands page fetch
    const response = await fetch(`${API_URL}/Cart/add`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        quantity
      })
    });

    if (!response.ok) {
      throw new Error(`Cart sync failed: ${response.status}`);
    }

    console.log("Cart synced with backend");
  } catch (err) {
    console.error("Cart sync error:", err);
  }
}

// 4. Keep other localStorage functions
export function removeFromCart(productId: number): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)
  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
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

  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
  return cart
}

export function clearCart(): Cart {
  const cart: Cart = { items: [], total: 0 }
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
  return cart
}

export function calculateTotal(cart: Cart): number {
  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return cart.total
}

// NEW: Backend cart functions (for cart page)
export const cartApi = {
  // Get cart from backend - like your brands page
  getCart: async () => {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/Cart`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status}`);
    }

    return response.json();
  },

  // Add to cart in backend
  addToCart: async (productId: number, quantity: number = 1) => {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/Cart/add`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId, quantity })
    });

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.status}`);
    }

    return response.json();
  },

  // Update quantity in backend
  updateItem: async (productId: number, quantity: number) => {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/Cart/${productId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
      throw new Error(`Failed to update cart: ${response.status}`);
    }

    return response.json();
  },

  // Remove from backend
  removeItem: async (productId: number) => {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/Cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to remove item: ${response.status}`);
    }

    return response.json();
  },

  // Clear cart in backend
  clearCart: async () => {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/Cart`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.status}`);
    }

    return response.json();
  },
};