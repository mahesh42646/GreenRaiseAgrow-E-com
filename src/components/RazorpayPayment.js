'use client';

import { useEffect } from 'react';

const RazorpayPayment = ({ amount, currency = 'INR', orderId, customerName, customerEmail, customerPhone, razorpayKey, onSuccess, onFailure, onClose }) => {
  useEffect(() => {
    if (!razorpayKey) {
      console.error('Razorpay key is required');
      onFailure({ error: 'Razorpay key is missing' });
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency,
        name: 'GreenRaise Agrow',
        description: 'Eco-friendly products purchase',
        handler: function (response) {
          onSuccess(response);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        notes: {
          address: 'GreenRaise Agrow Corporate Office'
        },
        theme: {
          color: '#08A486'
        },
        modal: {
          ondismiss: function() {
            onClose();
          }
        }
      };
      
      if (orderId) {
        options.order_id = orderId;
      }
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response) {
        onFailure(response.error);
      });
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      onFailure({ error: 'Failed to load payment gateway' });
    };

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [amount, currency, orderId, customerName, customerEmail, customerPhone, razorpayKey, onSuccess, onFailure, onClose]);

  return null; // This component doesn't render anything visible
};

export default RazorpayPayment; 