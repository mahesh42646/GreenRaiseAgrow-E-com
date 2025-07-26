 // API service for connecting to the backend

const API_URL = 'https://greenraiseagro.in/api/ecom';
const RAZORPAY_API_URL = 'https://greenraiseagro.in/api';

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
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
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

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