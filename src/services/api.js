 // API service for connecting to the backend

const API_URL = 'https://greenraiseagro.in/api/ecom';
const RAZORPAY_API_URL = 'https://greenraiseagro.in/api';

// Cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generic fetch function with error handling and caching
async function fetchAPI(endpoint, options = {}) {
  const cacheKey = `${options.method || 'GET'}_${endpoint}_${JSON.stringify(options.body || '')}`;
  
  // Check cache for GET requests
  if (!options.method || options.method === 'GET') {
    const cached = apiCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`Cache hit: ${API_URL}${endpoint}`);
      return cached.data;
    }
  }

  try {
    console.log(`API Request: ${API_URL}${endpoint}`, { 
      method: options.method || 'GET',
      headers: options.headers
    });
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: `${API_URL}${endpoint}`,
        errorData
      });
      throw new Error(errorData.message || 'Something went wrong');
    }

    const data = await response.json();
    console.log(`API Response: ${API_URL}${endpoint}`, data);
    
    // Cache GET responses
    if (!options.method || options.method === 'GET') {
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Clear cache function
export const clearApiCache = () => {
  apiCache.clear();
};

// Clear cache for specific endpoint
export const clearCacheForEndpoint = (endpoint) => {
  for (const [key] of apiCache) {
    if (key.includes(endpoint)) {
      apiCache.delete(key);
    }
  }
};

// Razorpay specific fetch function
async function fetchRazorpayAPI(endpoint, options = {}) {
  try {
    console.log(`Razorpay API Request: ${RAZORPAY_API_URL}${endpoint}`, { 
      method: options.method || 'GET',
      headers: options.headers
    });
    
    const response = await fetch(`${RAZORPAY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Razorpay API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: `${RAZORPAY_API_URL}${endpoint}`,
        errorData
      });
      throw new Error(errorData.message || 'Something went wrong');
    }

    const data = await response.json();
    console.log(`Razorpay API Response: ${RAZORPAY_API_URL}${endpoint}`, data);
    return data;
  } catch (error) {
    console.error('Razorpay API Error:', error);
    throw error;
  }
}

// Product related API calls
export const productAPI = {
  getAllProducts: () => fetchAPI('/products'),
  
  getProductById: (id) => fetchAPI(`/products/${id}`),
  
  createProduct: (productData) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  updateProduct: (id, productData) => fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  deleteProduct: (id) => fetchAPI(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  addReview: (productId, reviewData) => fetchAPI(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  // FAQ endpoints
  getFaqs: (productId) => fetchAPI(`/products/${productId}`), // faqs are in product object
  addFaq: (productId, faq) => fetchAPI(`/products/${productId}/faqs`, {
    method: 'POST',
    body: JSON.stringify(faq),
  }),
  updateFaq: (productId, faqId, faq) => fetchAPI(`/products/${productId}/faqs/${faqId}`, {
    method: 'PUT',
    body: JSON.stringify(faq),
  }),
  deleteFaq: (productId, faqId) => fetchAPI(`/products/${productId}/faqs/${faqId}`, {
    method: 'DELETE',
  }),
  // Questions endpoints
  getQuestions: (productId) => fetchAPI(`/products/${productId}/questions`),
  addQuestion: (productId, question) => fetchAPI(`/products/${productId}/questions`, {
    method: 'POST',
    body: JSON.stringify(question),
  }),
  answerQuestion: (productId, questionId, answer, answererName, answererEmail) => fetchAPI(`/products/${productId}/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify({ answer, answererName, answererEmail }),
  }),
};

// Blog related API calls
export const blogAPI = {
  getAllBlogs: () => fetchAPI('/blogs'),
  
  getBlogByIdentifier: (identifier) => fetchAPI(`/blogs/${identifier}`),
  
  createBlog: (blogData) => fetchAPI('/blogs', {
    method: 'POST',
    body: JSON.stringify(blogData),
  }),
  
  updateBlog: (id, blogData) => fetchAPI(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(blogData),
  }),
  
  deleteBlog: (id) => fetchAPI(`/blogs/${id}`, {
    method: 'DELETE',
  }),
  
  addComment: (blogId, commentData) => fetchAPI(`/blogs/${blogId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  }),
};

// User profile related API calls
export const profileAPI = {
  getUserProfile: (userId) => fetchAPI(`/profile/${userId}`),
  
  createFirebaseUser: (firebaseUid, name, email, phone) => {
    console.log('Creating Firebase user with data:', { firebaseUid, name, email, phone });
    return fetchAPI('/profile/firebase/create', {
      method: 'POST',
      body: JSON.stringify({ firebaseUid, name, email, phone }),
    });
  },
  
  updateUserProfile: (userId, profileData) => fetchAPI(`/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  addAddress: (userId, addressData) => fetchAPI(`/profile/${userId}/addresses`, {
    method: 'POST',
    body: JSON.stringify(addressData),
  }),
  
  getCart: (userId) => fetchAPI(`/profile/${userId}/cart`),
  
  addToCart: (userId, cartData) => fetchAPI(`/profile/${userId}/cart`, {
    method: 'POST',
    body: JSON.stringify(cartData),
  }),
  
  updateCartItemQuantity: (userId, cartData) => fetchAPI(`/profile/${userId}/cart`, {
    method: 'PUT',
    body: JSON.stringify(cartData),
  }),
  
  removeFromCart: (userId, cartData) => fetchAPI(`/profile/${userId}/cart`, {
    method: 'DELETE',
    body: JSON.stringify(cartData),
  }),
  
  clearCart: (userId) => fetchAPI(`/profile/${userId}/cart/clear`, {
    method: 'DELETE',
  }),
  
  getWishlist: (userId) => fetchAPI(`/profile/${userId}/wishlist`),
  
  addToWishlist: (userId, wishlistData) => fetchAPI(`/profile/${userId}/wishlist`, {
    method: 'POST',
    body: JSON.stringify(wishlistData),
  }),
  getUserOrders: (userId) => fetchAPI(`/orders/user/${userId}`),
  placeOrder: (orderData) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  login: (email, password) => fetchAPI('/profile/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password, phone) => fetchAPI('/profile/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  }),
  updateOrderStatus: (orderId, status, userId) => fetchAPI(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, userId }),
  }),
  syncCart: (userId, cartData) => fetchAPI(`/profile/${userId}/cart/sync`, {
    method: 'POST',
    body: JSON.stringify(cartData),
  }),
};

// Email verification related API calls
export const emailVerificationAPI = {
  sendVerificationEmail: (email, name) => fetchAPI('/email-verification/send-verification', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  }),
  
  verifyOTP: (email, otp) => fetchAPI('/email-verification/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  }),
  
  resendOTP: (email) => fetchAPI('/email-verification/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

// Contact related API calls
export const contactAPI = {
  submitContactForm: (formData) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
  
  getAllContacts: () => fetchAPI('/contact'),
  
  getContactById: (id) => fetchAPI(`/contact/${id}`),
  
  updateContact: (id, contactData) => fetchAPI(`/contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contactData),
  }),
};

// Razorpay related API calls
export const razorpayAPI = {
  getKey: () => fetchRazorpayAPI('/razorpay/key'),
  
  createOrder: (orderData) => fetchRazorpayAPI('/razorpay/order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
};

const apiServices = {
  product: productAPI,
  blog: blogAPI,
  profile: profileAPI,
  contact: contactAPI,
  razorpay: razorpayAPI,
};

export default apiServices; 