'use client';

import Header from '../eng/components/header';
import Footer from '../eng/components/footer';

export default function TermsAndConditions() {
  return (
    <div>
      <Header />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-3" style={{ color: '#000' }}>
                Terms and Conditions
              </h1>
              <p className="text-muted">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <hr className="my-4" />
            </div>

            {/* Terms Content */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>1. Acceptance of Terms</h2>
                <p className="text-muted">
                  By accessing and using GreenRaise ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>2. Use License</h2>
                <p className="text-muted mb-3">
                  Permission is granted to temporarily download one copy of the materials (information or software) on GreenRaise's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="text-muted">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on GreenRaise's website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>3. Product Information</h2>
                <p className="text-muted mb-3">
                  We strive to provide accurate product information, including descriptions, pricing, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
                <p className="text-muted">
                  All eco-friendly products are sourced from verified sustainable suppliers, but we cannot guarantee specific environmental impact metrics.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>4. Pricing and Payment</h2>
                <p className="text-muted mb-3">
                  All prices are shown in the local currency and are subject to change without notice. Payment must be made at the time of order placement.
                </p>
                <p className="text-muted">
                  We accept major credit cards, debit cards, and other payment methods as indicated on our website. All transactions are processed securely.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>5. Shipping and Delivery</h2>
                <p className="text-muted mb-3">
                  We offer eco-friendly shipping options with carbon-neutral delivery where possible. Delivery times may vary based on your location and the shipping method selected.
                </p>
                <p className="text-muted">
                  Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>6. Returns and Refunds</h2>
                <p className="text-muted mb-3">
                  We accept returns within 30 days of delivery for most items. Products must be in their original condition and packaging.
                </p>
                <p className="text-muted">
                  Refunds will be processed within 5-7 business days after we receive and inspect the returned item.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>7. Privacy and Data Protection</h2>
                <p className="text-muted mb-3">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
                </p>
                <p className="text-muted">
                  We collect and process personal data in accordance with applicable data protection laws and regulations.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>8. Environmental Commitment</h2>
                <p className="text-muted mb-3">
                  As an eco-friendly marketplace, we are committed to sustainability. We partner with suppliers who share our environmental values.
                </p>
                <p className="text-muted">
                  We strive to minimize our carbon footprint through sustainable packaging and shipping practices.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>9. Limitation of Liability</h2>
                <p className="text-muted">
                  In no event shall GreenRaise or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GreenRaise's website.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>10. Governing Law</h2>
                <p className="text-muted">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which GreenRaise operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>11. Changes to Terms</h2>
                <p className="text-muted">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>12. Contact Information</h2>
                <p className="text-muted mb-2">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="text-muted">
                  <p className="mb-1">
                    <i className="bi bi-envelope me-2"></i>
                    Email: legal@greenraise.com
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone me-2"></i>
                    Phone: +1 (555) 123-4567
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-geo-alt me-2"></i>
                    Address: 123 Green Street, Eco City, EC 12345
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-5 p-4 bg-light rounded">
                <h5 className="fw-bold mb-3" style={{ color: '#000' }}>
                  Questions About Our Terms?
                </h5>
                <p className="text-muted mb-3">
                  We're here to help clarify any part of our terms and conditions.
                </p>
                <a 
                  href="/contact" 
                  className="btn fw-bold px-4 py-2"
                  style={{ backgroundColor: '#000', color: 'white' }}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
