const API_BASE = 'https://localhost:44306/api';

// Get user cart from backend API - MATCHES YOUR WORKING CART API
export const fetchUserCart = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log("Fetching cart from:", `${API_BASE}/Cart`);
    console.log("Token:", token ? "Exists" : "Missing");
    
    const response = await fetch(`${API_BASE}/Cart`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      // REMOVED: credentials: 'include'
    });

    if (!response.ok) {
      console.error("Cart fetch failed:", response.status, response.statusText);
      throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Cart data received:", data);
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { items: [], total: 0 };
  }
};

// Create order - SAME PATTERN
export const createOrder = async (orderData: any) => {
  const token = localStorage.getItem('token');
  console.log("Creating order with token:", token ? "Exists" : "Missing");
  
  const response = await fetch(`${API_BASE}/Orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    // REMOVED: credentials: 'include'
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
};

// Create transaction - SAME PATTERN
export const createTransaction = async (transactionData: any) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/Transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    // REMOVED: credentials: 'include'
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create transaction');
  }

  return response.json();
};