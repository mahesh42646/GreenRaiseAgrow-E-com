'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';
import { useCart } from '../../context/CartContext';
import RazorpayPayment from '../../components/RazorpayPayment';
import { useAuth } from '../../context/AuthContext';
import { profileAPI, razorpayAPI } from '../../services/api';

export default function CheckoutPage() {
  // All hooks at the top
  const router = useRouter();
  const { cartItems, getCartTotals, loading } = useCart();
  const { user, setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    createAccount: false,
    password: '',
    confirmPassword: '',
    orderNotes: '',
    saveInfo: true
  });
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [razorpayKey, setRazorpayKey] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Show loading while cart is loading
  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Redirect to cart if cart is empty
  if (!cartItems || cartItems.length === 0) {
    router.push('/cart');
    return null;
  }
  
  // Get cart totals from context
  const { subtotal, shippingCost, total } = getCartTotals();
  
  // Debug: Log cart items to see what's causing NaN
  console.log('Cart Items:', cartItems);
  console.log('Cart Totals:', { subtotal, shippingCost, total });
  
  // Filter valid cart items
  const validCartItems = cartItems.filter(item => 
    item && 
    item.productId && 
    item.name && 
    typeof item.price === 'number' && 
    typeof item.quantity === 'number' &&
    item.price > 0 &&
    item.quantity > 0
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 2) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }
    
    // Initialize payment
    setPaymentLoading(true);
    try {
      // Get Razorpay key
      const keyResponse = await razorpayAPI.getKey();
      setRazorpayKey(keyResponse.key);
      
      // Create Razorpay order
      const orderResponse = await razorpayAPI.createOrder({
        amount: total,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });
      
      setOrderId(orderResponse.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    setShowPayment(false);
    let currentUser = user;
    // Register user if needed
    if (!user && formData.createAccount && formData.email && formData.password) {
      try {
        const registered = await profileAPI.register(
          `${formData.firstName} ${formData.lastName}`,
          formData.email,
          formData.password,
          formData.phone
        );
        setUser(registered);
        currentUser = registered;
      } catch (err) {
        // Optionally show error
      }
    }
    const orderData = {
      userId: currentUser?.userId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      orderNotes: formData.orderNotes,
      items: validCartItems,
      subtotal,
      shippingCost,
      total,
      paymentStatus: response?.test ? 'paid' : 'paid',
      paymentDetails: response
    };
    try {
      await profileAPI.placeOrder(orderData);
      if (currentUser?.userId) {
        await profileAPI.addAddress(currentUser.userId, {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          isDefault: true
        });
      }
    } catch (err) {}
    router.push('/checkout/success');
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment failed:', error);
    setShowPayment(false);
    alert('Payment failed. Please try again.');
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  const handleCashOnDelivery = async () => {
    let currentUser = user;
    if (!user && formData.createAccount && formData.email && formData.password) {
      try {
        const registered = await profileAPI.register(
          `${formData.firstName} ${formData.lastName}`,
          formData.email,
          formData.password,
          formData.phone
        );
        setUser(registered);
        currentUser = registered;
      } catch (err) {}
    }
    const orderData = {
      userId: currentUser?.userId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      orderNotes: formData.orderNotes,
      items: validCartItems,
      subtotal,
      shippingCost,
      total,
      paymentStatus: 'cod',
      paymentDetails: { method: 'Cash on Delivery' }
    };
    try {
      await profileAPI.placeOrder(orderData);
      if (currentUser?.userId) {
        await profileAPI.addAddress(currentUser.userId, {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          isDefault: true
        });
      }
    } catch (err) {}
    router.push('/checkout/success');
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      router.push('/cart');
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="mb-3">Checkout</h1>
            <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1" style={{ height: '4px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ 
                  width: `${(step / 2) * 100}%`, 
                  backgroundColor: '#08A486' 
                }} 
                aria-valuenow={(step / 2) * 100} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <div className="ms-3 text-muted small">
              Step {step} of 2
            </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Checkout Form */}
          <div className="col-lg-8 mb-4 mb-lg-0">
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Shipping Information */}
                  {step === 1 && (
                    <>
                      <h4 className="mb-4">Shipping Information</h4>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="firstName" className="form-label">First Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="lastName" className="form-label">Last Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label">Email Address*</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label">Phone Number*</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="city" className="form-label">City*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="state" className="form-label">State*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="zipCode" className="form-label">ZIP Code*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="country" className="form-label">Country*</label>
                        <select
                          className="form-select"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="orderNotes" className="form-label">Order Notes (optional)</label>
                        <textarea
                          className="form-control"
                          id="orderNotes"
                          name="orderNotes"
                          rows="3"
                          placeholder="Special instructions for delivery or any other notes"
                          value={formData.orderNotes}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      {!user && (
                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="createAccount"
                              name="createAccount"
                              checked={formData.createAccount}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="createAccount">
                              Create an account for faster checkout next time
                            </label>
                          </div>
                        </div>
                      )}
                      {formData.createAccount && !user && (
                        <div className="row mb-3">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label">Password*</label>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required={formData.createAccount}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                            <input
                              type="password"
                              className="form-control"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required={formData.createAccount}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Step 2: Review Order */}
                  {step === 2 && (
                    <>
                      <h4 className="mb-4">Review Your Order</h4>
                      
                      <div className="mb-4">
                        <h6 className="mb-3">Shipping Information</h6>
                        <div className="card bg-light">
                          <div className="card-body">
                            <p className="mb-1">
                              <strong>{formData.firstName} {formData.lastName}</strong>
                            </p>
                            <p className="mb-1">{formData.address}</p>
                            <p className="mb-1">{formData.city}, {formData.state} {formData.zipCode}</p>
                            <p className="mb-1">{formData.country}</p>
                            <p className="mb-1">
                              <strong>Email:</strong> {formData.email}
                            </p>
                            <p className="mb-1">
                              <strong>Phone:</strong> {formData.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="mb-3">Payment Method</h6>
                        <div className="card bg-light">
                          <div className="card-body">
                            <p className="mb-0">
                              <i className="bi bi-credit-card me-2"></i>
                              Razorpay Payment Gateway
                            </p>
                            <small className="text-muted">Secure payment processing by Razorpay</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="mb-3">Order Items</h6>
                        <div className="card bg-light">
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th className="text-end">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {validCartItems.map(item => (
                                    <tr key={item.productId}>
                                      <td>{item.name}</td>
                                      <td>{item.quantity}</td>
                                      <td className="text-end">₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {formData.orderNotes && (
                        <div className="mb-4">
                          <h6 className="mb-2">Order Notes</h6>
                          <p className="bg-light p-3 rounded">{formData.orderNotes}</p>
                        </div>
                      )}
                      
                      <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        By clicking &quot;Place Order&quot;, you agree to our terms and conditions and privacy policy.
                      </div>
                      <div className="text-center mt-3">
                        <button className="btn btn-warning" onClick={handleCashOnDelivery}>
                          Cash on Delivery
                        </button>
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={goBack}
                    >
                      {step === 1 ? 'Back to Cart' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="btn"
                      style={{ backgroundColor: '#08A486', color: 'white' }}
                      disabled={isSubmitting || paymentLoading}
                    >
                      {isSubmitting || paymentLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {paymentLoading ? 'Initializing Payment...' : 'Processing...'}
                        </>
                      ) : step < 2 ? 'Continue' : 'Proceed to Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>
                
                <div className="mb-3">
                  {validCartItems.map(item => (
                    <div key={item.productId} className="d-flex align-items-center mb-2">
                      <div className="flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                        <Image 
                          src={item.image || 'https://via.placeholder.com/50'} 
                          alt={item.name} 
                          className="rounded" 
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover' }}
                          unoptimized={true}
                        />
                      </div>
                      <div className="ms-2 flex-grow-1">
                        <p className="mb-0 small">{item.name}</p>
                        <p className="mb-0 text-muted small">Qty: {item.quantity}</p>
                      </div>
                      <div className="ms-auto">
                        <p className="mb-0 fw-bold">₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold fs-5">₹{total.toFixed(2)}</span>
                </div>
                
                <div className="d-grid">
                  <Link href="/cart" className="btn btn-outline-secondary">
                    <i className="bi bi-cart me-2"></i>
                    Edit Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Razorpay Payment Component */}
      {showPayment && razorpayKey && (
        <>
          <RazorpayPayment
            amount={total}
            currency="INR"
            orderId={orderId}
            customerName={`${formData.firstName} ${formData.lastName}`}
            customerEmail={formData.email}
            customerPhone={formData.phone}
            razorpayKey={razorpayKey}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
            onClose={handlePaymentClose}
          />
          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={() => handlePaymentSuccess({ test: true })}>
              Payment Done (Test)
            </button>
          </div>
        </>
      )}
      
      <Footer />
    </>
  );
}
