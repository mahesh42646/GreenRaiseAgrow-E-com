'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../eng/components/header';
import Footer from '../../eng/components/footer';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrderNumber);
    
    // Clear cart data (in a real app, this would be handled by your cart context/state)
    // localStorage.removeItem('cart');
  }, []);

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="mb-4">
              <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-check-lg text-white fs-1"></i>
              </div>
            </div>
            
            <h1 className="mb-3">Thank You for Your Order!</h1>
            <p className="lead mb-4">Your order has been received and is now being processed.</p>
            
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Order Information</h5>
                <div className="row mb-3">
                  <div className="col-sm-6 text-sm-end fw-bold">Order Number:</div>
                  <div className="col-sm-6 text-sm-start">{orderNumber}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 text-sm-end fw-bold">Order Date:</div>
                  <div className="col-sm-6 text-sm-start">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 text-sm-end fw-bold">Payment Method:</div>
                  <div className="col-sm-6 text-sm-start">Credit Card</div>
                </div>
                <div className="row">
                  <div className="col-sm-6 text-sm-end fw-bold">Shipping Method:</div>
                  <div className="col-sm-6 text-sm-start">Standard Shipping</div>
                </div>
              </div>
            </div>
            
            <p className="mb-4">
              We&apos;ve sent a confirmation email to your email address with the order details.
              You can check the status of your order at any time in your account.
            </p>
            
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link href="/" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
                <i className="bi bi-house me-2"></i>
                Return to Home
              </Link>
              <Link href="/shop" className="btn btn-outline-secondary">
                <i className="bi bi-bag me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 