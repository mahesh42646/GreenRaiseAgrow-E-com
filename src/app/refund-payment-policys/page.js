'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function RefundPaymentPolicy() {
  const [activeSection, setActiveSection] = useState('refund');

  const sections = [
    { id: 'refund', title: 'Refund Policy', icon: 'bi-arrow-clockwise' },
    { id: 'payment', title: 'Payment Policy', icon: 'bi-credit-card' },
    { id: 'shipping', title: 'Shipping & Returns', icon: 'bi-truck' },
    { id: 'cancellation', title: 'Cancellation Policy', icon: 'bi-x-circle' }
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="fw-bold mb-3" style={{ color: '#08A486' }}>
                Refund & Payment Policies
              </h1>
              <p className="text-muted fs-5">
                Transparent policies for your peace of mind. Learn about our refund, payment, and shipping procedures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex flex-wrap justify-content-center mb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`btn mx-2 mb-2 px-4 py-2 ${
                    activeSection === section.id
                      ? 'text-white'
                      : 'btn-outline-success'
                  }`}
                  style={{
                    backgroundColor: activeSection === section.id ? '#08A486' : 'transparent',
                    borderColor: '#08A486',
                    color: activeSection === section.id ? 'white' : '#08A486'
                  }}
                  onClick={() => setActiveSection(section.id)}
                >
                  <i className={`bi ${section.icon} me-2`}></i>
                  {section.title}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-3 shadow-sm p-4">
              {activeSection === 'refund' && (
                <div>
                  <h2 className="fw-bold mb-4" style={{ color: '#08A486' }}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refund Policy
                  </h2>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#FFA53B' }}>
                            <i className="bi bi-check-circle me-2"></i>
                            Eligible for Refund
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-dot text-success me-2"></i>
                              Damaged or defective products
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-dot text-success me-2"></i>
                              Wrong items received
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-dot text-success me-2"></i>
                              Quality issues within 30 days
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-dot text-success me-2"></i>
                              Unopened items in original packaging
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#dc3545' }}>
                            <i className="bi bi-x-circle me-2"></i>
                            Not Eligible for Refund
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-dot text-danger me-2"></i>
                              Used or opened items (unless defective)
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-dot text-danger me-2"></i>
                              Perishable or consumable products
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-dot text-danger me-2"></i>
                              Custom or personalized items
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-dot text-danger me-2"></i>
                              Items purchased on clearance
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <h6 className="fw-bold">
                      <i className="bi bi-info-circle me-2"></i>
                      Refund Process
                    </h6>
                    <ol className="mb-0">
                      <li>Contact our customer service within 30 days of delivery</li>
                      <li>Provide order number and reason for return</li>
                      <li>Receive return authorization and shipping label</li>
                      <li>Ship item back in original packaging</li>
                      <li>Refund processed within 5-7 business days</li>
                    </ol>
                  </div>
                </div>
              )}

              {activeSection === 'payment' && (
                <div>
                  <h2 className="fw-bold mb-4" style={{ color: '#08A486' }}>
                    <i className="bi bi-credit-card me-2"></i>
                    Payment Policy
                  </h2>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#FFA53B' }}>
                            <i className="bi bi-shield-check me-2"></i>
                            Accepted Payment Methods
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-credit-card me-2 text-primary"></i>
                              Credit/Debit Cards (Visa, MasterCard, American Express)
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-paypal me-2 text-primary"></i>
                              PayPal
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-phone me-2 text-primary"></i>
                              Digital Wallets (Apple Pay, Google Pay)
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-bank me-2 text-primary"></i>
                              Bank Transfers (for bulk orders)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#FFA53B' }}>
                            <i className="bi bi-lock me-2"></i>
                            Security & Privacy
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="bi bi-shield-lock me-2 text-success"></i>
                              SSL encrypted transactions
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-eye-slash me-2 text-success"></i>
                              Payment data never stored
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-pci-card me-2 text-success"></i>
                              PCI DSS compliant
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-verified me-2 text-success"></i>
                              Fraud protection enabled
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-warning">
                    <h6 className="fw-bold">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Important Notes
                    </h6>
                    <ul className="mb-0">
                      <li>All prices are in USD unless otherwise stated</li>
                      <li>Sales tax will be added based on your location</li>
                      <li>Payment is processed at the time of order confirmation</li>
                      <li>Failed payments will result in order cancellation</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'shipping' && (
                <div>
                  <h2 className="fw-bold mb-4" style={{ color: '#08A486' }}>
                    <i className="bi bi-truck me-2"></i>
                    Shipping & Returns
                  </h2>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#FFA53B' }}>
                            <i className="bi bi-truck me-2"></i>
                            Shipping Information
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <strong>Standard Shipping:</strong> 3-5 business days
                            </li>
                            <li className="mb-2">
                              <strong>Express Shipping:</strong> 1-2 business days
                            </li>
                            <li className="mb-2">
                              <strong>Free Shipping:</strong> Orders over $50
                            </li>
                            <li className="mb-2">
                              <strong>International:</strong> 7-14 business days
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#FFA53B' }}>
                            <i className="bi bi-arrow-return-left me-2"></i>
                            Return Process
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <strong>Return Window:</strong> 30 days from delivery
                            </li>
                            <li className="mb-2">
                              <strong>Return Shipping:</strong> Free for defective items
                            </li>
                            <li className="mb-2">
                              <strong>Restocking Fee:</strong> 10% for non-defective returns
                            </li>
                            <li className="mb-2">
                              <strong>Processing Time:</strong> 5-7 business days
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-success">
                    <h6 className="fw-bold">
                      <i className="bi bi-leaf me-2"></i>
                      Eco-Friendly Shipping
                    </h6>
                    <p className="mb-0">
                      We use sustainable packaging materials and carbon-neutral shipping options 
                      to minimize our environmental impact. All packaging is recyclable or biodegradable.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'cancellation' && (
                <div>
                  <h2 className="fw-bold mb-4" style={{ color: '#08A486' }}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancellation Policy
                  </h2>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#28a745' }}>
                            <i className="bi bi-check-circle me-2"></i>
                            Order Cancellation
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <strong>Before Processing:</strong> Full refund
                            </li>
                            <li className="mb-2">
                              <strong>During Processing:</strong> 95% refund
                            </li>
                            <li className="mb-2">
                              <strong>After Shipping:</strong> Return required
                            </li>
                            <li className="mb-2">
                              <strong>Custom Orders:</strong> Non-cancellable
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: '#FFA53B' }}>
                            <i className="bi bi-clock me-2"></i>
                            Processing Times
                          </h5>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <strong>Order Processing:</strong> 1-2 business days
                            </li>
                            <li className="mb-2">
                              <strong>Payment Processing:</strong> 24-48 hours
                            </li>
                            <li className="mb-2">
                              <strong>Refund Processing:</strong> 5-7 business days
                            </li>
                            <li className="mb-2">
                              <strong>Bank Credit:</strong> 3-10 business days
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <h6 className="fw-bold">
                      <i className="bi bi-telephone me-2"></i>
                      Need Help?
                    </h6>
                    <p className="mb-2">
                      If you need to cancel an order or have questions about our policies, 
                      please contact our customer service team:
                    </p>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <i className="bi bi-envelope me-2"></i>
                          support@greenraise.com
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <i className="bi bi-telephone me-2"></i>
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h3 className="fw-bold mb-3" style={{ color: '#08A486' }}>
                Still Have Questions?
              </h3>
              <p className="text-muted mb-4">
                Our customer service team is here to help you with any questions about our policies.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/contact" className="btn px-4 py-2 text-white" style={{ backgroundColor: '#08A486' }}>
                  <i className="bi bi-chat-dots me-2"></i>
                  Contact Us
                </Link>
                <Link href="/faq" className="btn btn-outline-success px-4 py-2" style={{ borderColor: '#08A486', color: '#08A486' }}>
                  <i className="bi bi-question-circle me-2"></i>
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
