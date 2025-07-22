'use client';

import Header from '../eng/components/header';
import Footer from '../eng/components/footer';

export default function RefundPaymentPolicy() {
  return (
    <div>
      <Header />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-3" style={{ color: '#000' }}>
                Refund & Payment Policies
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

            {/* Policies Content */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>1. Refund Policy</h2>
                <p className="text-muted mb-3">
                  We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, we&apos;re here to help.
                </p>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Eligible for Refund:</h5>
                <ul className="text-muted mb-3">
                  <li>Damaged or defective products</li>
                  <li>Wrong items received</li>
                  <li>Quality issues within 30 days</li>
                  <li>Unopened items in original packaging</li>
                </ul>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Not Eligible for Refund:</h5>
                <ul className="text-muted mb-3">
                  <li>Used or opened items (unless defective)</li>
                  <li>Perishable or consumable products</li>
                  <li>Custom or personalized items</li>
                  <li>Items purchased on clearance</li>
                </ul>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Refund Process:</h5>
                <ol className="text-muted">
                  <li>Contact our customer service within 30 days of delivery</li>
                  <li>Provide order number and reason for return</li>
                  <li>Receive return authorization and shipping label</li>
                  <li>Ship item back in original packaging</li>
                  <li>Refund processed within 5-7 business days</li>
                </ol>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>2. Payment Policy</h2>
                <p className="text-muted mb-3">
                  We offer secure and convenient payment options to make your shopping experience smooth and worry-free.
                </p>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Accepted Payment Methods:</h5>
                <ul className="text-muted mb-3">
                  <li>Credit/Debit Cards (Visa, MasterCard, American Express)</li>
                  <li>PayPal</li>
                  <li>Digital Wallets (Apple Pay, Google Pay)</li>
                  <li>Bank Transfers (for bulk orders)</li>
                </ul>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Security & Privacy:</h5>
                <ul className="text-muted mb-3">
                  <li>SSL encrypted transactions</li>
                  <li>Payment data never stored</li>
                  <li>PCI DSS compliant</li>
                  <li>Fraud protection enabled</li>
                </ul>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Important Notes:</h5>
                <ul className="text-muted">
                  <li>All prices are in USD unless otherwise stated</li>
                  <li>Sales tax will be added based on your location</li>
                  <li>Payment is processed at the time of order confirmation</li>
                  <li>Failed payments will result in order cancellation</li>
                </ul>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>3. Shipping & Returns</h2>
                <p className="text-muted mb-3">
                  We provide reliable shipping services with eco-friendly packaging to minimize our environmental impact.
                </p>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Shipping Information:</h5>
                <ul className="text-muted mb-3">
                  <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                  <li><strong>Express Shipping:</strong> 1-2 business days</li>
                  <li><strong>Free Shipping:</strong> Orders over $50</li>
                  <li><strong>International:</strong> 7-14 business days</li>
                </ul>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Return Process:</h5>
                <ul className="text-muted mb-3">
                  <li><strong>Return Window:</strong> 30 days from delivery</li>
                  <li><strong>Return Shipping:</strong> Free for defective items</li>
                  <li><strong>Restocking Fee:</strong> 10% for non-defective returns</li>
                  <li><strong>Processing Time:</strong> 5-7 business days</li>
                </ul>
                <p className="text-muted">
                  <strong>Eco-Friendly Shipping:</strong> We use sustainable packaging materials and carbon-neutral shipping options 
                  to minimize our environmental impact. All packaging is recyclable or biodegradable.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#000' }}>4. Cancellation Policy</h2>
                <p className="text-muted mb-3">
                  We understand that sometimes you need to cancel an order. Here&apos;s our cancellation policy to help you understand the process.
                </p>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Order Cancellation:</h5>
                <ul className="text-muted mb-3">
                  <li><strong>Before Processing:</strong> Full refund</li>
                  <li><strong>During Processing:</strong> 95% refund</li>
                  <li><strong>After Shipping:</strong> Return required</li>
                  <li><strong>Custom Orders:</strong> Non-cancellable</li>
                </ul>
                <h5 className="fw-bold mb-2" style={{ color: '#000' }}>Processing Times:</h5>
                <ul className="text-muted mb-3">
                  <li><strong>Order Processing:</strong> 1-2 business days</li>
                  <li><strong>Payment Processing:</strong> 24-48 hours</li>
                  <li><strong>Refund Processing:</strong> 5-7 business days</li>
                  <li><strong>Bank Credit:</strong> 3-10 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
