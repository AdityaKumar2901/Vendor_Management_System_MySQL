// API client for communicating with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Get user from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set user in localStorage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Remove user from localStorage
  removeUser() {
    localStorage.removeItem('user');
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.removeToken();
        this.removeUser();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
      this.setUser(data.data.user);
    }
    
    return data;
  }

  async register(name, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
      this.setUser(data.data.user);
    }
    
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  logout() {
    this.removeToken();
    this.removeUser();
  }

  // Dashboard
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Vendors
  async getVendors(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/vendors${query ? `?${query}` : ''}`);
  }

  async getVendor(id) {
    return this.request(`/vendors/${id}`);
  }

  async createVendor(vendor) {
    return this.request('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
  }

  async updateVendor(id, vendor) {
    return this.request(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor),
    });
  }

  async deleteVendor(id) {
    return this.request(`/vendors/${id}`, {
      method: 'DELETE',
    });
  }

  // Contacts
  async getVendorContacts(vendorId) {
    return this.request(`/vendors/${vendorId}/contacts`);
  }

  async createVendorContact(vendorId, contact) {
    return this.request(`/vendors/${vendorId}/contacts`, {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateContact(contactId, contact) {
    return this.request(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
  }

  async deleteContact(contactId) {
    return this.request(`/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  // Products
  async getVendorProducts(vendorId) {
    return this.request(`/vendors/${vendorId}/products`);
  }

  async createVendorProduct(vendorId, product) {
    return this.request(`/vendors/${vendorId}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(productId, product) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Purchase Orders
  async getPurchaseOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/purchase-orders${query ? `?${query}` : ''}`);
  }

  async getPurchaseOrder(id) {
    return this.request(`/purchase-orders/${id}`);
  }

  async createPurchaseOrder(purchaseOrder) {
    return this.request('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(purchaseOrder),
    });
  }

  async updatePurchaseOrder(id, purchaseOrder) {
    return this.request(`/purchase-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(purchaseOrder),
    });
  }

  async updatePurchaseOrderItems(id, items) {
    return this.request(`/purchase-orders/${id}/items`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  async deletePurchaseOrder(id) {
    return this.request(`/purchase-orders/${id}`, {
      method: 'DELETE',
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
