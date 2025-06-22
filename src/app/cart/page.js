'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, loading, updateCartItemQuantity, removeFromCart, clearCart, getCartTotals } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Calculate totals
  const { subtotal, shippingCost, total } = getCartTotals();

  // Handle coupon application
  const handleApplyCoupon = () => {
    // In a real app, this would validate the coupon code with an API
    if (couponCode.toLowerCase() === 'eco20') {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };

  // Ensure cartItems is an array before using map
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="mb-4">Your Shopping Cart</h1>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your cart...</p>
          </div>
        ) : safeCartItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
            <h3>Your cart is empty</h3>
            <p className="text-muted mb-4">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/shop" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th scope="col" colSpan="2">Product</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Total</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeCartItems.map(item => (
                          <tr key={item.productId}>
                            <td style={{ width: '80px' }}>
                              <img 
                                src={item.image || 'https://via.placeholder.com/80'} 
                                alt={item.name} 
                                className="img-fluid rounded" 
                              />
                            </td>
                            <td>
                              <h6 className="mb-0">
                                <Link href={`/product-details/${item.productId}`} className="text-decoration-none text-dark">
                                  {item.name}
                                </Link>
                              </h6>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                              <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input 
                                  type="text" 
                                  className="form-control text-center" 
                                  value={item.quantity}
                                  readOnly
                                />
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromCart(item.productId)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Link href="/shop" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Continue Shopping
                    </Link>
                    <button className="btn btn-outline-danger" onClick={clearCart}>
                      <i className="bi bi-trash me-2"></i>
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span className="fw-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold fs-5">${(total - discount).toFixed(2)}</span>
                  </div>
                  
                  {!couponApplied && (
                    <div className="mb-3">
                      <label htmlFor="couponCode" className="form-label">Coupon Code</label>
                      <div className="input-group mb-1">
                        <input
                          type="text"
                          className="form-control"
                          id="couponCode"
                          placeholder="Enter coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={handleApplyCoupon}
                        >
                          Apply
                        </button>
                      </div>
                      <small className="text-muted">Try "ECO20" for 20% off</small>
                    </div>
                  )}
                  
                  <Link 
                    href="/checkout" 
                    className="btn w-100" 
                    style={{ backgroundColor: '#08A486', color: 'white' }}
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 