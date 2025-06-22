'use client';

import { useState } from 'react';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';
import { contactAPI } from '../../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit form data to the API
      await contactAPI.submitContactForm(formData);
      
      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-5 fw-bold mb-3">Contact Us</h1>
            <p className="lead text-muted">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
        </div>

        <div className="row">
          {/* Contact Form */}
          <div className="col-lg-7 mb-5 mb-lg-0">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                {submitStatus === 'success' && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    There was an error submitting your form. Please try again.
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
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
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">Message*</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-lg"
                    style={{ backgroundColor: '#08A486', color: 'white' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="col-lg-5">
            <div className="ps-lg-5">
              <h3 className="mb-4">Get In Touch</h3>
              
              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ backgroundColor: '#08A48620' }}>
                    <i className="bi bi-geo-alt fs-4" style={{ color: '#08A486' }}></i>
                  </div>
                </div>
                <div className="ms-3">
                  <h5>Our Location</h5>
                  <p className="text-muted mb-0">123 Green Street, Eco City</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ backgroundColor: '#08A48620' }}>
                    <i className="bi bi-telephone fs-4" style={{ color: '#08A486' }}></i>
                  </div>
                </div>
                <div className="ms-3">
                  <h5>Phone Number</h5>
                  <p className="text-muted mb-0">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ backgroundColor: '#08A48620' }}>
                    <i className="bi bi-envelope fs-4" style={{ color: '#08A486' }}></i>
                  </div>
                </div>
                <div className="ms-3">
                  <h5>Email Address</h5>
                  <p className="text-muted mb-0">info@greenraise.com</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ backgroundColor: '#08A48620' }}>
                    <i className="bi bi-clock fs-4" style={{ color: '#08A486' }}></i>
                  </div>
                </div>
                <div className="ms-3">
                  <h5>Business Hours</h5>
                  <p className="text-muted mb-0">Monday - Friday: 9am to 5pm</p>
                  <p className="text-muted mb-0">Saturday: 10am to 2pm</p>
                </div>
              </div>
              
              <div className="mt-5">
                <h5 className="mb-3">Follow Us</h5>
                <div className="d-flex">
                  <a href="#" className="me-3" style={{ color: '#08A486', fontSize: '1.5rem' }}>
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="me-3" style={{ color: '#08A486', fontSize: '1.5rem' }}>
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="me-3" style={{ color: '#08A486', fontSize: '1.5rem' }}>
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" style={{ color: '#08A486', fontSize: '1.5rem' }}>
                    <i className="bi bi-linkedin"></i>
                  </a>
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