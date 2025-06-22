'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';

export default function CheckoutPage() {
  const router = useRouter();
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
    country: 'United States',
    createAccount: false,
    password: '',
    confirmPassword: '',
    paymentMethod: 'credit',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    orderNotes: '',
    saveInfo: true
  });

  // Simulated cart data
  const cartItems = [
    {
      id: 1,
      name: 'Organic Plant Food',
      price: 15.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      name: 'Bamboo Toothbrush Set',
      price: 12.99,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 3,
      name: 'Reusable Produce Bags',
      price: 13.99,
      quantity: 3,
      image: 'https://via.placeholder.com/80',
    }
  ];

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/checkout/success');
    } catch (error) {
      console.error('Error processing checkout:', error);
      setIsSubmitting(false);
    }
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
                    width: `${(step / 3) * 100}%`, 
                    backgroundColor: '#08A486' 
                  }} 
                  aria-valuenow={(step / 3) * 100} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="ms-3 text-muted small">
                Step {step} of 3
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
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

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

                      {formData.createAccount && (
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

                  {/* Step 2: Payment Information */}
                  {step === 2 && (
                    <>
                      <h4 className="mb-4">Payment Information</h4>
                      <div className="mb-4">
                        <div className="d-flex flex-wrap gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="creditCard"
                              value="credit"
                              checked={formData.paymentMethod === 'credit'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="creditCard">
                              <i className="bi bi-credit-card me-2"></i>
                              Credit Card
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="paypal"
                              value="paypal"
                              checked={formData.paymentMethod === 'paypal'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="paypal">
                              <i className="bi bi-paypal me-2"></i>
                              PayPal
                            </label>
                          </div>
                        </div>
                      </div>

                      {formData.paymentMethod === 'credit' && (
                        <>
                          <div className="mb-3">
                            <label htmlFor="cardName" className="form-label">Name on Card*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="cardName"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleChange}
                              required={formData.paymentMethod === 'credit'}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="cardNumber" className="form-label">Card Number*</label>
                            <input
                              type="text"
                              className="form-control"
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="XXXX XXXX XXXX XXXX"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              required={formData.paymentMethod === 'credit'}
                            />
                          </div>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="expiryDate" className="form-label">Expiry Date*</label>
                              <input
                                type="text"
                                className="form-control"
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required={formData.paymentMethod === 'credit'}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="cvv" className="form-label">CVV*</label>
                              <input
                                type="text"
                                className="form-control"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleChange}
                                required={formData.paymentMethod === 'credit'}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {formData.paymentMethod === 'paypal' && (
                        <div className="alert alert-info">
                          <i className="bi bi-info-circle me-2"></i>
                          You will be redirected to PayPal to complete your payment after reviewing your order.
                        </div>
                      )}

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

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="saveInfo"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="saveInfo">
                          Save this information for next time
                        </label>
                      </div>
                    </>
                  )}

                  {/* Step 3: Review Order */}
                  {step === 3 && (
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
                            <p className="mb-0">
                              <strong>Phone:</strong> {formData.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="mb-3">Payment Method</h6>
                        <div className="card bg-light">
                          <div className="card-body">
                            {formData.paymentMethod === 'credit' ? (
                              <p className="mb-0">
                                <i className="bi bi-credit-card me-2"></i>
                                Credit Card ending in {formData.cardNumber.slice(-4)}
                              </p>
                            ) : (
                              <p className="mb-0">
                                <i className="bi bi-paypal me-2"></i>
                                PayPal
                              </p>
                            )}
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
                                  {cartItems.map(item => (
                                    <tr key={item.id}>
                                      <td>{item.name}</td>
                                      <td>{item.quantity}</td>
                                      <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : step < 3 ? 'Continue' : 'Place Order'}
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
                  {cartItems.map(item => (
                    <div key={item.id} className="d-flex align-items-center mb-2">
                      <div className="flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          className="rounded" 
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ms-2 flex-grow-1">
                        <p className="mb-0 small">{item.name}</p>
                        <p className="mb-0 text-muted small">Qty: {item.quantity}</p>
                      </div>
                      <div className="ms-auto">
                        <p className="mb-0 fw-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr />
                
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
                
                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold fs-5">${total.toFixed(2)}</span>
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
      <Footer />
    </>
  );
}
