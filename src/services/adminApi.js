// Admin API service for connecting to the backend

import { productAPI, blogAPI, contactAPI } from './api';

const API_URL = 'https://greenraiseagro.in/api/ecom';

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    // In a real app, we would add admin authentication token here
    const adminToken = localStorage.getItem('adminToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
      ...options.headers,
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('Admin API Error:', error);
    throw error;
  }
}

// Admin authentication
export const adminAuthAPI = {
  login: async (credentials) => {
    // In a real app, this would be an actual API call
    // For now, we'll simulate with hardcoded values
    if (credentials.email === 'admin@greenraise.com' && credentials.password === '12345') {
      const adminData = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@greenraise.com',
        role: 'admin',
        token: 'simulated-jwt-token'
      };
      
      localStorage.setItem('adminToken', adminData.token);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      
      return adminData;
    } else {
      throw new Error('Invalid credentials');
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  
  checkAuth: () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminToken && adminUser) {
      return JSON.parse(adminUser);
    }
    
    return null;
  }
};

// Dashboard statistics
export const dashboardAPI = {
  getStats: async () => {
    try {
      // In a real app, this would be a dedicated API endpoint
      // For now, we'll simulate by aggregating data from other endpoints
      
      // Get products, orders, users, etc.
      const products = await productAPI.getAllProducts();
      const blogs = await blogAPI.getAllBlogs();
      const contacts = await contactAPI.getAllContacts();
      
      // Calculate statistics
      const totalProducts = products.length;
      const totalBlogs = blogs.length;
      const totalContacts = contacts.length;
      
      // Simulate other data
      const totalUsers = 25;
      const totalOrders = 42;
      const totalRevenue = 4289.75;
      
      // Recent activity (simulated)
      const recentActivity = [
        { type: 'order', id: 'ORD-10011', user: 'John Doe', action: 'placed an order', amount: 89.97, date: new Date().toISOString() },
        { type: 'product', id: 'PRD-5001', user: 'Admin', action: 'added a new product', date: new Date(Date.now() - 3600000).toISOString() },
        { type: 'user', id: 'USR-2008', user: 'Emily Wilson', action: 'registered', date: new Date(Date.now() - 7200000).toISOString() },
        { type: 'contact', id: 'CNT-3012', user: 'Michael Brown', action: 'submitted a contact form', date: new Date(Date.now() - 10800000).toISOString() },
      ];
      
      return {
        counts: {
          products: totalProducts,
          blogs: totalBlogs,
          users: totalUsers,
          orders: totalOrders,
          contacts: totalContacts
        },
        revenue: {
          total: totalRevenue,
          today: 289.97,
          weekly: 1245.50,
          monthly: totalRevenue
        },
        recentActivity,
        topProducts: products.slice(0, 5).map(p => ({
          id: p.productId,
          name: p.productName,
          price: p.actualPrice,
          sales: Math.floor(Math.random() * 100)
        })),
        topUsers: [
          { id: 'USR-1001', name: 'John Doe', email: 'john.doe@example.com', orders: 5, spent: 234.95 },
          { id: 'USR-1002', name: 'Jane Smith', email: 'jane.smith@example.com', orders: 3, spent: 178.50 },
          { id: 'USR-1003', name: 'Robert Johnson', email: 'robert.j@example.com', orders: 2, spent: 89.99 }
        ]
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

// Orders management
export const adminOrdersAPI = {
  getAllOrders: async () => {
    return await fetchAPI('/orders');
  },
  
  getOrderById: async (id) => {
    // In a real app, this would be an API call
    // For now, we'll return simulated data
    return {
      id,
      customer: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      date: '2023-05-15',
      status: 'Delivered',
      payment: 'Credit Card',
      shipping: 'Standard',
      total: 89.97,
      items: [
        {
          id: 'PRD-1001',
          name: 'Organic Plant Food',
          price: 15.99,
          quantity: 2,
          total: 31.98
        },
        {
          id: 'PRD-2002',
          name: 'Bamboo Toothbrush Set',
          price: 12.99,
          quantity: 1,
          total: 12.99
        },
        {
          id: 'PRD-3003',
          name: 'Reusable Produce Bags',
          price: 15.00,
          quantity: 3,
          total: 45.00
        }
      ],
      shippingAddress: {
        street: '123 Green St',
        city: 'Eco City',
        state: 'CA',
        zipCode: '12345',
        country: 'United States'
      },
      billingAddress: {
        street: '123 Green St',
        city: 'Eco City',
        state: 'CA',
        zipCode: '12345',
        country: 'United States'
      },
      notes: 'Please leave package at the front door'
    };
  },
  
  updateOrderStatus: async (id, status) => {
    return await fetchAPI(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  deleteOrder: async (id) => {
    // In a real app, this would be an API call
    // For now, we'll simulate success
    return { success: true, id };
  }
};

// Users management
export const adminUsersAPI = {
  getAllUsers: async () => {
    try {
      // In a real app, this would fetch from a dedicated users endpoint
      // Since we don't have that yet, we'll simulate with empty data
      // that would be populated from the API
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  getUserById: async (id) => {
    // In a real app, this would be an API call
    // For now, we'll return simulated data
    return {
      id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      status: 'active',
      orders: 5,
      spent: 234.95,
      joined: '2023-01-15',
      addresses: [
        {
          id: 'ADDR-1',
          type: 'shipping',
          isDefault: true,
          street: '123 Green St',
          city: 'Eco City',
          state: 'CA',
          zipCode: '12345',
          country: 'United States'
        }
      ],
      recentOrders: [
        { id: 'ORD-10001', date: '2023-05-15', status: 'Delivered', total: 89.97 },
        { id: 'ORD-10004', date: '2023-05-10', status: 'Delivered', total: 45.99 },
        { id: 'ORD-10009', date: '2023-04-28', status: 'Delivered', total: 29.99 }
      ]
    };
  },
  
  updateUserStatus: async (id, status) => {
    // In a real app, this would be an API call
    // For now, we'll simulate success
    return { success: true, id, status };
  },
  
  deleteUser: async (id) => {
    // In a real app, this would be an API call
    // For now, we'll simulate success
    return { success: true, id };
  }
};

// Tickets management (using contact API)
export const adminTicketsAPI = {
  getAllTickets: async () => {
    try {
      const contacts = await contactAPI.getAllContacts();
      return contacts.map(contact => ({
        id: contact.contactId,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        date: contact.createdAt,
        responseDate: contact.responseDate,
        responseMessage: contact.responseMessage
      }));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },
  
  getTicketById: async (id) => {
    try {
      const contact = await contactAPI.getContactById(id);
      return {
        id: contact.contactId,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        date: contact.createdAt,
        responseDate: contact.responseDate,
        responseMessage: contact.responseMessage,
        respondedBy: contact.respondedBy
      };
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },
  
  updateTicket: async (id, ticketData) => {
    try {
      const updatedContact = await contactAPI.updateContact(id, ticketData);
      return {
        id: updatedContact.contactId,
        status: updatedContact.status
      };
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }
};

const adminAPI = {
  auth: adminAuthAPI,
  dashboard: dashboardAPI,
  orders: adminOrdersAPI,
  users: adminUsersAPI,
  tickets: adminTicketsAPI,
  products: productAPI,
  blogs: blogAPI,
  contacts: contactAPI
};

export default adminAPI; 