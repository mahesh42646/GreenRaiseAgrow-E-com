'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ShippingDeliveryPolicies() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'shipping-methods', title: 'Shipping Methods' },
    { id: 'delivery-times', title: 'Delivery Times' },
    { id: 'shipping-costs', title: 'Shipping Costs' },
    { id: 'order-tracking', title: 'Order Tracking' },
    { id: 'delivery-areas', title: 'Delivery Areas' },
    { id: 'package-protection', title: 'Package Protection' },
    { id: 'eco-friendly-shipping', title: 'Eco-Friendly Shipping' },
    { id: 'international-shipping', title: 'International Shipping' },
    { id: 'contact-support', title: 'Contact & Support' }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-4">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">Shipping & Delivery Policies</h1>
              <p className="text-muted mb-0">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <Link 
              href="/"
              className="btn btn-success px-4 py-2 fw-semibold"
              style={{ backgroundColor: '#08A486', borderColor: '#08A486' }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-bold text-dark">Quick Navigation</h5>
              </div>
              <div className="card-body p-0">
                <nav className="nav flex-column">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`nav-link text-start border-0 rounded-0 py-3 px-4 ${
                        activeSection === section.id
                          ? 'active fw-bold'
                          : 'text-muted'
                      }`}
                      style={{
                        backgroundColor: activeSection === section.id ? '#e8f5e8' : 'transparent',
                        color: activeSection === section.id ? '#08A486' : 'inherit',
                        borderLeft: activeSection === section.id ? '4px solid #08A486' : 'none'
                      }}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                
                {/* Overview Section */}
                <section id="overview" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Overview</h2>
                  <div className="text-muted">
                    <p className="mb-3">
                      Welcome to GreenRaise&apos;s comprehensive shipping and delivery information. We understand that 
                      reliable shipping is crucial for your eco-friendly shopping experience. Our commitment extends 
                      beyond just delivering products - we ensure every package reflects our environmental values.
                    </p>
                    <p>
                      From sustainable packaging materials to carbon-neutral shipping options, every aspect of our 
                      delivery process is designed with both your satisfaction and environmental responsibility in mind. 
                      We partner with carriers who share our commitment to reducing carbon footprints.
                    </p>
                  </div>
                </section>

                {/* Shipping Methods Section */}
                <section id="shipping-methods" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Shipping Methods</h2>
                  <div className="text-muted">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <i className="bi bi-truck fs-2 me-3" style={{ color: '#08A486' }}></i>
                              <h4 className="h5 fw-semibold text-dark mb-0">Standard Shipping</h4>
                            </div>
                            <p className="mb-2">Perfect for regular orders</p>
                            <ul className="list-unstyled">
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>5-7 business days</li>
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>Full tracking included</li>
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>Sustainable packaging</li>
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>Carbon offset included</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <i className="bi bi-lightning-charge fs-2 me-3" style={{ color: '#FFA53B' }}></i>
                              <h4 className="h5 fw-semibold text-dark mb-0">Premium Express</h4>
                            </div>
                            <p className="mb-2">For urgent eco-friendly needs</p>
                            <ul className="list-unstyled">
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>2-3 business days</li>
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>Priority processing</li>
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>Real-time updates</li>
                              <li><i className="bi bi-check-circle-fill text-success me-2"></i>Signature confirmation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Delivery Times Section */}
                <section id="delivery-times" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Delivery Times</h2>
                  <div className="text-muted">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Service Type</th>
                            <th>Processing Time</th>
                            <th>Transit Time</th>
                            <th>Total Delivery</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Standard Shipping</strong></td>
                            <td>1-2 business days</td>
                            <td>4-5 business days</td>
                            <td>5-7 business days</td>
                          </tr>
                          <tr>
                            <td><strong>Premium Express</strong></td>
                            <td>Same day (before 3 PM)</td>
                            <td>1-2 business days</td>
                            <td>2-3 business days</td>
                          </tr>
                          <tr>
                            <td><strong>International</strong></td>
                            <td>1-2 business days</td>
                            <td>8-12 business days</td>
                            <td>9-14 business days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="alert alert-info mt-3" style={{ backgroundColor: '#e8f5e8', borderColor: '#08A486', color: '#08A486' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Important:</strong> Delivery times may vary during peak seasons, holidays, or extreme weather conditions. 
                      We&apos;ll send you notifications if any delays occur.
                    </div>
                  </div>
                </section>

                {/* Shipping Costs Section */}
                <section id="shipping-costs" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Shipping Costs</h2>
                  <div className="text-muted">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-header bg-white">
                            <h5 className="mb-0 fw-bold text-dark">Domestic Shipping Rates</h5>
                          </div>
                          <div className="card-body">
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <strong>Orders under $75:</strong> $7.99 standard shipping
                              </li>
                              <li className="mb-2">
                                <strong>Orders $75-$149:</strong> $4.99 standard shipping
                              </li>
                              <li className="mb-2">
                                <strong>Orders $150+:</strong> FREE standard shipping
                              </li>
                              <li className="mb-2">
                                <strong>Premium Express:</strong> +$15.99
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-header bg-white">
                            <h5 className="mb-0 fw-bold text-dark">International Shipping Rates</h5>
                          </div>
                          <div className="card-body">
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <strong>Canada:</strong> $19.99
                              </li>
                              <li className="mb-2">
                                <strong>Mexico:</strong> $22.99
                              </li>
                              <li className="mb-2">
                                <strong>European Union:</strong> $29.99
                              </li>
                              <li className="mb-2">
                                <strong>Other International:</strong> $34.99
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Order Tracking Section */}
                <section id="order-tracking" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Order Tracking</h2>
                  <div className="text-muted">
                    <p className="mb-3">Stay informed about your eco-friendly order&apos;s journey:</p>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-1-circle-fill fs-4 me-3" style={{ color: '#08A486' }}></i>
                          <div>
                            <h5 className="fw-semibold text-dark">Order Confirmation</h5>
                            <p>Instant email confirmation with order details and estimated delivery date.</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-2-circle-fill fs-4 me-3" style={{ color: '#08A486' }}></i>
                          <div>
                            <h5 className="fw-semibold text-dark">Processing Status</h5>
                            <p>Updates when your order is being prepared with eco-friendly packaging.</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-3-circle-fill fs-4 me-3" style={{ color: '#08A486' }}></i>
                          <div>
                            <h5 className="fw-semibold text-dark">Shipping Notification</h5>
                            <p>Tracking number and carrier information sent via email and SMS.</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-4-circle-fill fs-4 me-3" style={{ color: '#08A486' }}></i>
                          <div>
                            <h5 className="fw-semibold text-dark">Delivery Updates</h5>
                            <p>Real-time tracking updates and delivery notifications from our partners.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Delivery Areas Section */}
                <section id="delivery-areas" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Delivery Areas</h2>
                  <div className="text-muted">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <h4 className="h5 fw-semibold text-dark mb-3">United States Coverage</h4>
                        <p>Complete coverage across all US territories:</p>
                        <ul>
                          <li>All 50 states (continental US)</li>
                          <li>Alaska and Hawaii</li>
                          <li>Puerto Rico and US Virgin Islands</li>
                          <li>Guam and other US territories</li>
                        </ul>
                      </div>
                      <div className="col-md-6 mb-4">
                        <h4 className="h5 fw-semibold text-dark mb-3">Global Shipping</h4>
                        <p>Worldwide delivery to major regions:</p>
                        <ul>
                          <li>North America (Canada, Mexico)</li>
                          <li>European Union (all 27 countries)</li>
                          <li>United Kingdom and Switzerland</li>
                          <li>Australia, New Zealand, and Japan</li>
                          <li>Select countries in Asia and South America</li>
                        </ul>
                      </div>
                    </div>
                    <div className="alert alert-warning" style={{ backgroundColor: '#fff3cd', borderColor: '#FFA53B', color: '#856404' }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Shipping Restrictions:</strong> Certain products may have regional restrictions due to local regulations 
                      or carrier limitations. We&apos;ll inform you during checkout if any restrictions apply.
                    </div>
                  </div>
                </section>

                {/* Package Protection Section */}
                <section id="package-protection" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Package Protection</h2>
                  <div className="text-muted">
                    <p className="mb-3">Your eco-friendly products deserve the best protection during transit:</p>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="text-center">
                          <i className="bi bi-shield-check fs-1 mb-3" style={{ color: '#08A486' }}></i>
                          <h5 className="fw-semibold text-dark">Premium Packaging</h5>
                          <p>Multi-layer protection using sustainable materials to ensure safe delivery of all products.</p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="text-center">
                          <i className="bi bi-box-seam fs-1 mb-3" style={{ color: '#08A486' }}></i>
                          <h5 className="fw-semibold text-dark">Specialized Handling</h5>
                          <p>Fragile items receive extra care with custom packaging solutions and handling instructions.</p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="text-center">
                          <i className="bi bi-truck fs-1 mb-3" style={{ color: '#08A486' }}></i>
                          <h5 className="fw-semibold text-dark">Full Insurance</h5>
                          <p>Comprehensive coverage for loss, damage, or theft during the entire shipping process.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Eco-Friendly Shipping Section */}
                <section id="eco-friendly-shipping" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Eco-Friendly Shipping</h2>
                  <div className="text-muted">
                    <p className="mb-3">
                      Our shipping practices reflect our commitment to environmental sustainability:
                    </p>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <h4 className="h5 fw-semibold text-dark mb-3">Sustainable Materials</h4>
                        <ul>
                          <li>100% recycled cardboard packaging</li>
                          <li>Biodegradable cornstarch packing peanuts</li>
                          <li>Recycled paper and cardboard dividers</li>
                          <li>Plant-based adhesive tapes</li>
                          <li>Water-based ink printing</li>
                        </ul>
                      </div>
                      <div className="col-md-6 mb-4">
                        <h4 className="h5 fw-semibold text-dark mb-3">Carbon Reduction</h4>
                        <ul>
                          <li>Carbon-neutral shipping options available</li>
                          <li>Eco-friendly carrier partnerships</li>
                          <li>Optimized route planning</li>
                          <li>Consolidated shipments</li>
                          <li>Local fulfillment centers</li>
                        </ul>
                      </div>
                    </div>
                    <div className="alert alert-success" style={{ backgroundColor: '#d1e7dd', borderColor: '#08A486', color: '#0f5132' }}>
                      <i className="bi bi-leaf me-2"></i>
                      <strong>Environmental Impact:</strong> Every shipment contributes to our tree-planting initiative. 
                      We&apos;ve planted over 50,000 trees through our shipping program to date.
                    </div>
                  </div>
                </section>

                {/* International Shipping Section */}
                <section id="international-shipping" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">International Shipping</h2>
                  <div className="text-muted">
                    <p className="mb-3">Global delivery with comprehensive support:</p>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <h4 className="h5 fw-semibold text-dark mb-3">Customs & Import Duties</h4>
                        <ul>
                          <li>All customs duties and taxes are customer responsibility</li>
                          <li>Customs clearance typically adds 2-4 days to delivery</li>
                          <li>Complete customs documentation provided</li>
                          <li>Duty rates vary by country and product category</li>
                          <li>Pre-paid duty options available for select countries</li>
                        </ul>
                      </div>
                      <div className="col-md-6 mb-4">
                        <h4 className="h5 fw-semibold text-dark mb-3">Product Restrictions</h4>
                        <ul>
                          <li>Organic products may require special permits</li>
                          <li>Battery-powered items have specific shipping requirements</li>
                          <li>Liquid products subject to volume restrictions</li>
                            <li>We&apos;ll notify you of any restrictions during checkout</li>
                          <li>Alternative products suggested when restrictions apply</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact & Support Section */}
                <section id="contact-support" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Contact & Support</h2>
                  <div className="text-muted">
                    <p className="mb-4">Our shipping support team is here to help with all your delivery questions:</p>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center">
                            <i className="bi bi-headset fs-1 mb-3" style={{ color: '#08A486' }}></i>
                            <h5 className="fw-semibold text-dark">Shipping Support</h5>
                            <p className="mb-2">Available Monday-Friday, 8 AM - 8 PM EST</p>
                            <p className="mb-3">
                              <i className="bi bi-telephone me-2"></i>
                              +1 (555) 123-4567
                            </p>
                            <p className="mb-0">
                              <i className="bi bi-envelope me-2"></i>
                              shipping@greenraise.com
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center">
                            <i className="bi bi-chat-dots fs-1 mb-3" style={{ color: '#08A486' }}></i>
                            <h5 className="fw-semibold text-dark">24/7 Chat Support</h5>
                            <p className="mb-3">Get instant answers to shipping questions anytime</p>
                            <button className="btn btn-success" style={{ backgroundColor: '#08A486', borderColor: '#08A486' }}>
                              Start Live Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="alert alert-info" style={{ backgroundColor: '#e8f5e8', borderColor: '#08A486', color: '#08A486' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Track Your Order:</strong> Access your order status and tracking information through your account dashboard 
                      or use the tracking number from your shipping confirmation email.
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
