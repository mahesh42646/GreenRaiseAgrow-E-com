'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';
import { useRef } from 'react';
import EmailVerificationModal from '../../components/EmailVerificationModal';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading, login, loginWithGoogle, register, logout, updateProfile, error } = useAuth();
    
  // Handle hash fragments for direct navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'orders', 'wishlist', 'profile'].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationName, setVerificationName] = useState('');

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      const fetchUserData = async () => {
        try {
          if (!user || !user.userId) {
            console.error('No user ID available');
            return;
          }
          const userProfile = await profileAPI.getUserProfile(user.userId);
          setAddresses(userProfile.addresses || []);
          const wishlistData = await profileAPI.getWishlist(user.userId);
          const userOrders = await profileAPI.getUserOrders(user.userId);
          setOrders(userOrders || []);
          setWishlist(wishlistData || []);
        } catch (err) {
          setOrders([]);
          setWishlist([]);
          setAddresses([]);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      const success = await login(loginForm.email, loginForm.password);
      
      if (!success) {
        setFormError(error || 'Invalid email or password');
      }
    } catch (err) {
      setFormError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError('');
    
    try {
      const success = await loginWithGoogle();
      
      if (!success) {
        setFormError(error || 'Google login failed');
      }
    } catch (err) {
      setFormError('Google login failed. Please try again.');
      console.error('Google login error:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (registerForm.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    // Show email verification modal instead of direct registration
    setVerificationEmail(registerForm.email);
    setVerificationName(`${registerForm.firstName} ${registerForm.lastName}`.trim());
    setShowEmailVerification(true);
  };

  const handleVerificationSuccess = async () => {
    try {
      // Now proceed with actual registration
      const success = await register(registerForm);
      
      if (!success) {
        setFormError(error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setFormError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const success = await updateProfile({
        name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        country: userData.country
      });
      
      if (success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (err) {
      alert('Error updating profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    });
  };

  const handleRegisterFormChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value
    });
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    try {
      await profileAPI.updateOrderStatus(selectedOrder._id, 'cancelled', user.userId);
      setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: 'cancelled' } : o));
      setShowOrderModal(false);
      setSelectedOrder(null);
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  // Combine addresses from user profile and orders, deduplicate
  const getAllUniqueAddresses = () => {
    const addressKey = addr => [
      addr.street?.trim().toLowerCase() || '',
      addr.city?.trim().toLowerCase() || '',
      addr.state?.trim().toLowerCase() || '',
      addr.zipCode?.trim().toLowerCase() || '',
      addr.country?.trim().toLowerCase() || ''
    ].join('|');

    // Addresses from user profile
    const profileAddresses = addresses || [];

    // Addresses from orders with same email
    const orderAddresses = (orders || [])
      .filter(order => order.customerEmail === userData.email)
      .map(order => ({
        street: order.shippingAddress,
        city: order.city,
        state: order.state,
        zipCode: order.zipCode,
        country: order.country,
        addressType: 'order',
        isDefault: false
      }));

    // Combine and deduplicate
    const all = [...profileAddresses, ...orderAddresses];
    const seen = new Set();
    const unique = [];
    for (const addr of all) {
      const key = addressKey(addr);
      if (!seen.has(key) && key.replace(/\|/g, '') !== '') {
        seen.add(key);
        unique.push(addr);
      }
    }
    return unique;
  };

  const uniqueAddresses = getAllUniqueAddresses();

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading account information...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="mb-4">My Account</h1>
        
        {!user ? (
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">Login</h3>
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label">Email Address*</label>
                      <input
                        type="email"
                        className="form-control"
                        id="loginEmail"
                        name="email"
                        value={loginForm.email}
                        onChange={handleLoginFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="loginPassword" className="form-label">Password*</label>
                      <input
                        type="password"
                        className="form-control"
                        id="loginPassword"
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input type="checkbox" className="form-check-input" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn" 
                        style={{ backgroundColor: '#08A486', color: 'white' }}
                      >
                        Login
                      </button>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="mb-2">- OR -</div>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary w-100"
                        onClick={handleGoogleLogin}
                      >
                        <i className="bi bi-google me-2"></i>
                        Continue with Google
                      </button>
                    </div>
                    <div className="mt-3 text-center">
                      <a href="#" className="text-decoration-none">Forgot your password?</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">Register</h3>
                  <form onSubmit={handleRegister}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="registerFirstName" className="form-label">First Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="registerFirstName"
                          name="firstName"
                          value={registerForm.firstName}
                          onChange={handleRegisterFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="registerLastName" className="form-label">Last Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="registerLastName"
                          name="lastName"
                          value={registerForm.lastName}
                          onChange={handleRegisterFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="registerEmail" className="form-label">Email Address*</label>
                      <input
                        type="email"
                        className="form-control"
                        id="registerEmail"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="registerPassword" className="form-label">Password*</label>
                      <input
                        type="password"
                        className="form-control"
                        id="registerPassword"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password*</label>
                      <input
                        type="password"
                        className="form-control"
                        id="registerConfirmPassword"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input type="checkbox" className="form-check-input" id="agreeTerms" required />
                      <label className="form-check-label" htmlFor="agreeTerms">
                        I agree to the <a href="#" className="text-decoration-none">terms and conditions</a>
                      </label>
                    </div>
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn" 
                        style={{ backgroundColor: '#08A486', color: 'white' }}
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-3 mb-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-person fs-1 text-muted"></i>
                    </div>
                    <h5 className="mb-0">{userData.firstName} {userData.lastName}</h5>
                    <p className="text-muted small">{userData.email}</p>
                  </div>
                  
                  <div className="list-group list-group-flush">
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => setActiveTab('dashboard')}
                      style={activeTab === 'dashboard' ? { backgroundColor: '#08A486', color: 'white' } : {}}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                      onClick={() => setActiveTab('orders')}
                      style={activeTab === 'orders' ? { backgroundColor: '#08A486', color: 'white' } : {}}
                    >
                      <i className="bi bi-bag me-2"></i>
                      Orders
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'wishlist' ? 'active' : ''}`}
                      onClick={() => setActiveTab('wishlist')}
                      style={activeTab === 'wishlist' ? { backgroundColor: '#08A486', color: 'white' } : {}}
                    >
                      <i className="bi bi-heart me-2"></i>
                      Wishlist
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                      style={activeTab === 'profile' ? { backgroundColor: '#08A486', color: 'white' } : {}}
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      Profile
                    </button>
                    <button 
                      className="list-group-item list-group-item-action text-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-9">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title mb-4">Dashboard</h3>
                    
                    <p className="mb-4">
                      Hello <strong>{userData.firstName}</strong>, welcome to your account dashboard.
                      Here you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
                    </p>
                    
                    <div className="row g-4 mb-4">
                      <div className="col-md-4">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <div className="mb-3">
                              <i className="bi bi-bag fs-1 text-primary"></i>
                            </div>
                            <h5>{orders.length}</h5>
                            <p className="text-muted mb-0">Orders</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <div className="mb-3">
                              <i className="bi bi-heart fs-1 text-danger"></i>
                            </div>
                            <h5>{wishlist.length}</h5>
                            <p className="text-muted mb-0">Wishlist Items</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <div className="mb-3">
                              <i className="bi bi-geo-alt fs-1 text-success"></i>
                            </div>
                            <h5>{uniqueAddresses.length}</h5>
                            <p className="text-muted mb-0">Address{uniqueAddresses.length !== 1 ? 'es' : ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="mb-3">Recent Orders</h5>
                    {orders.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 3).map(order => (
                              showOrderModal && selectedOrder && selectedOrder._id === order._id ? null :
                              <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>
                                    {order.status || order.paymentStatus || 'Processing'}
                                  </span>
                                </td>
                                <td>₹{order.total?.toFixed(2)}</td>
                                <td>
                                  {order.items && Array.isArray(order.items)
                                    ? order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
                                    : ''}
                                </td>
                                <td>
                                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleViewOrder(order)}>View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        You haven&apos;t placed any orders yet.
                      </div>
                    )}
                    
                    {orders.length > 3 && (
                      <div className="text-center mt-3">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => setActiveTab('orders')}
                        >
                          View All Orders
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title mb-4">My Orders</h3>
                    
                    {orders.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total</th>
                              <th>Items</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(order => (
                              showOrderModal && selectedOrder && selectedOrder._id === order._id ? null :
                              <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>
                                    {order.status || order.paymentStatus || 'Processing'}
                                  </span>
                                </td>
                                <td>₹{order.total?.toFixed(2)}</td>
                                <td>
                                  {order.items && Array.isArray(order.items)
                                    ? order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
                                    : ''}
                                </td>
                                <td>
                                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleViewOrder(order)}>View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        You haven&apos;t placed any orders yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title mb-4">My Wishlist</h3>
                    
                    {wishlist.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wishlist.map(item => (
                              <tr key={item.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Image 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="img-fluid rounded me-3" 
                                      style={{ width: '50px', height: '50px' }}
                                      width={50}
                                      height={50}
                                    />
                                    <div>{item.name}</div>
                                  </div>
                                </td>
                                <td>₹{item.price.toFixed(2)}</td>
                                <td>
                                  <div className="btn-group">
                                    <button className="btn btn-sm" style={{ backgroundColor: '#08A486', color: 'white' }}>
                                      <i className="bi bi-cart-plus me-1"></i>
                                      Add to Cart
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => removeFromWishlist(item.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        Your wishlist is empty.
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title mb-4">Profile Information</h3>
                    
                    <form onSubmit={handleProfileUpdate}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="profileFirstName" className="form-label">First Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="profileFirstName"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleUserDataChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="profileLastName" className="form-label">Last Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="profileLastName"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleUserDataChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="profileEmail" className="form-label">Email Address*</label>
                          <input
                            type="email"
                            className="form-control"
                            id="profileEmail"
                            value={userData.email}
                            readOnly
                          />
                          <small className="text-muted">Email cannot be changed</small>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="profilePhone" className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="profilePhone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleUserDataChange}
                          />
                        </div>
                      </div>
                      
                      <h5 className="mt-4 mb-3">Addresses</h5>
                      {uniqueAddresses.length === 0 ? (
                        <div className="alert alert-info">No addresses saved.</div>
                      ) : (
                        <ul className="list-group mb-4">
                          {uniqueAddresses.map((addr, idx) => (
                            <li key={idx} className="list-group-item">
                              <div><strong>{addr.addressType?.toUpperCase() || 'ADDRESS'}</strong></div>
                              <div>{addr.street}</div>
                              <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                              <div>{addr.country}</div>
                              {addr.isDefault && <span className="badge bg-success">Default</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <h5 className="mt-4 mb-3">Password</h5>
                      
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="currentPassword" className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="currentPassword"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="newPassword" className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmNewPassword"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button 
                          type="submit" 
                          className="btn" 
                          style={{ backgroundColor: '#08A486', color: 'white' }}
                        >
                          Update Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="card border-0">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Order <span className="text-muted">#{selectedOrder._id}</span></h5>
                    <div className="small text-muted">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={`badge px-3 py-2 fs-6 ${selectedOrder.status === 'complete' ? 'bg-success' : selectedOrder.status === 'cancelled' ? 'bg-danger' : selectedOrder.status === 'out for delivery' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>{selectedOrder.status?.toUpperCase() || selectedOrder.paymentStatus?.toUpperCase() || 'PROCESSING'}</span>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <h6 className="fw-bold mb-2">Shipping Address</h6>
                      <div className="small">
                        {selectedOrder.shippingAddress},<br />
                        {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode},<br />
                        {selectedOrder.country}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-2">Payment</h6>
                      <span className={`badge bg-light text-dark border px-3 py-2 fs-6 me-2`}>{selectedOrder.paymentDetails?.method ? selectedOrder.paymentDetails.method : (selectedOrder.paymentDetails?.upi ? 'UPI' : (selectedOrder.paymentDetails?.card ? 'Card' : 'Online'))}</span>
                      <div className="small text-muted mt-2">{selectedOrder.customerName || userData.firstName + ' ' + userData.lastName}<br />{selectedOrder.customerEmail}</div>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-3">Products</h6>
                  <div className="table-responsive mb-4">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price?.toFixed(2)}</td>
                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="mb-2 mb-md-0">
                    <span className="me-3"><strong>Subtotal:</strong> ₹{selectedOrder.subtotal?.toFixed(2)}</span>
                    <span className="me-3"><strong>Shipping:</strong> ₹{selectedOrder.shippingCost?.toFixed(2)}</span>
                    <span><strong>Total:</strong> <span className="fs-5">₹{selectedOrder.total?.toFixed(2)}</span></span>
                  </div>
                  <div>
                    {selectedOrder.status === 'placed' && (
                      <button className="btn btn-danger me-2" onClick={handleCancelOrder}>Cancel Order</button>
                    )}
                    <button className="btn btn-outline-secondary" onClick={handleCloseOrderModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        email={verificationEmail}
        name={verificationName}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
}
