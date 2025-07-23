'use client';
import Header from '../eng/components/header'; 
import Footer from '../eng/components/footer';
import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'data-collection', title: 'Data Collection' },
    { id: 'data-usage', title: 'How We Use Your Data' },
    { id: 'data-sharing', title: 'Data Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'changes', title: 'Policy Changes' },
    { id: 'contact', title: 'Contact Us' }
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
      <Header/> 
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-4">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">Privacy Policy</h1>
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
                      Welcome to GreenRaise, your trusted source for sustainable and eco-friendly products. 
                      We are committed to protecting your privacy and ensuring the security of your personal information. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, 
                      make purchases, or interact with our services.
                    </p>
                    <p>
                      By using our website and services, you consent to the data practices described in this policy. 
                      If you do not agree with our policies and practices, please do not use our website.
                    </p>
                  </div>
                </section>

                {/* Data Collection Section */}
                <section id="data-collection" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Data Collection</h2>
                  <div className="text-muted">
                    <p className="mb-3">We collect several types of information from and about users of our website:</p>
                    
                    <h4 className="h5 fw-semibold text-dark mb-3">Personal Information</h4>
                    <ul className="mb-4">
                      <li>Name and contact information (email address, phone number)</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely through our payment partners)</li>
                      <li>Account credentials and profile information</li>
                      <li>Communication preferences</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Usage Information</h4>
                    <ul className="mb-4">
                      <li>Browsing history and website interactions</li>
                      <li>Product preferences and shopping cart contents</li>
                      <li>Device information and IP addresses</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">User-Generated Content</h4>
                    <ul>
                      <li>Product reviews and ratings</li>
                      <li>Blog comments and feedback</li>
                      <li>Contact form submissions</li>
                      <li>Customer support communications</li>
                    </ul>
                  </div>
                </section>

                {/* Data Usage Section */}
                <section id="data-usage" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">How We Use Your Data</h2>
                  <div className="text-muted">
                    <p className="mb-3">We use the information we collect for various purposes:</p>
                    
                    <h4 className="h5 fw-semibold text-dark mb-3">Service Provision</h4>
                    <ul className="mb-4">
                      <li>Process and fulfill your orders</li>
                      <li>Manage your account and profile</li>
                      <li>Provide customer support and respond to inquiries</li>
                      <li>Send order confirmations and shipping updates</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Personalization</h4>
                    <ul className="mb-4">
                      <li>Personalize your shopping experience</li>
                      <li>Recommend products based on your preferences</li>
                      <li>Save your cart and wishlist items</li>
                      <li>Remember your login status and preferences</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Communication</h4>
                    <ul className="mb-4">
                      <li>Send marketing communications (with your consent)</li>
                      <li>Share updates about new products and promotions</li>
                      <li>Provide blog updates and educational content</li>
                      <li>Send important service announcements</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Improvement</h4>
                    <ul>
                      <li>Analyze website usage and performance</li>
                      <li>Improve our products and services</li>
                      <li>Conduct research and analytics</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>
                  </div>
                </section>

                {/* Data Sharing Section */}
                <section id="data-sharing" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Data Sharing</h2>
                  <div className="text-muted">
                    <p className="mb-3">We may share your information in the following circumstances:</p>
                    
                    <h4 className="h5 fw-semibold text-dark mb-3">Service Providers</h4>
                    <ul className="mb-4">
                      <li>Payment processors for secure transactions</li>
                      <li>Shipping partners for order fulfillment</li>
                      <li>Email service providers for communications</li>
                      <li>Analytics providers for website optimization</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Legal Requirements</h4>
                    <ul className="mb-4">
                      <li>Comply with applicable laws and regulations</li>
                      <li>Respond to legal requests and court orders</li>
                      <li>Protect our rights and property</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Business Transfers</h4>
                    <ul>
                      <li>In connection with a merger, acquisition, or sale of assets</li>
                      <li>With your explicit consent</li>
                      <li>For aggregated, anonymized data for research purposes</li>
                    </ul>
                  </div>
                </section>

                {/* Data Security Section */}
                <section id="data-security" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Data Security</h2>
                  <div className="text-muted">
                    <p className="mb-3">
                      We implement appropriate technical and organizational measures to protect your personal information:
                    </p>
                    
                    <ul className="mb-4">
                      <li>Encryption of sensitive data in transit and at rest</li>
                      <li>Secure authentication and access controls</li>
                      <li>Regular security assessments and updates</li>
                      <li>Employee training on data protection</li>
                      <li>Secure hosting and infrastructure</li>
                    </ul>

                    <p>
                      However, no method of transmission over the internet or electronic storage is 100% secure. 
                      While we strive to protect your personal information, we cannot guarantee absolute security.
                    </p>
                  </div>
                </section>

                {/* Your Rights Section */}
                <section id="your-rights" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Your Rights</h2>
                  <div className="text-muted">
                    <p className="mb-3">You have the following rights regarding your personal information:</p>
                    
                    <ul className="mb-4">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a portable format</li>
                      <li><strong>Restriction:</strong> Limit how we process your data</li>
                      <li><strong>Objection:</strong> Object to certain processing activities</li>
                      <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
                    </ul>

                    <p>
                      To exercise these rights, please contact us using the information provided below. 
                      We will respond to your request within 30 days.
                    </p>
                  </div>
                </section>

                {/* Cookies Section */}
                <section id="cookies" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Cookies & Tracking</h2>
                  <div className="text-muted">
                    <p className="mb-3">
                      We use cookies and similar tracking technologies to enhance your experience:
                    </p>
                    
                    <h4 className="h5 fw-semibold text-dark mb-3">Essential Cookies</h4>
                    <ul className="mb-4">
                      <li>Authentication and session management</li>
                      <li>Shopping cart functionality</li>
                      <li>Security and fraud prevention</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Analytics Cookies</h4>
                    <ul className="mb-4">
                      <li>Website usage analysis</li>
                      <li>Performance monitoring</li>
                      <li>User behavior insights</li>
                    </ul>

                    <h4 className="h5 fw-semibold text-dark mb-3">Marketing Cookies</h4>
                    <ul className="mb-4">
                      <li>Personalized advertising</li>
                      <li>Retargeting campaigns</li>
                      <li>Social media integration</li>
                    </ul>

                    <p>
                      You can control cookie settings through your browser preferences. 
                      However, disabling certain cookies may affect website functionality.
                    </p>
                  </div>
                </section>

                {/* Children's Privacy Section */}
                <section id="children" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Children&apos;s Privacy</h2>
                  <div className="text-muted">
                    <p className="mb-3">
                      Our website is not intended for children under the age of 13. 
                      We do not knowingly collect personal information from children under 13.
                    </p>
                    
                    <p>
                      If you are a parent or guardian and believe your child has provided us with personal information, 
                      please contact us immediately. We will take steps to remove such information from our records.
                    </p>
                  </div>
                </section>

                {/* Policy Changes Section */}
                <section id="changes" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Policy Changes</h2>
                  <div className="text-muted">
                    <p className="mb-3">
                      We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.
                    </p>
                    
                    <p className="mb-3">
                      We will notify you of any material changes by:
                    </p>
                    
                    <ul className="mb-4">
                      <li>Posting the updated policy on our website</li>
                      <li>Sending email notifications to registered users</li>
                      <li>Displaying prominent notices on our website</li>
                    </ul>

                    <p>
                      Your continued use of our website after any changes constitutes acceptance of the updated policy.
                    </p>
                  </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-4">Contact Us</h2>
                  <div className="text-muted">
                    <p className="mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    
                    <div className="bg-light p-4 rounded">
                      <h4 className="h5 fw-semibold text-dark mb-3">GreenRaise</h4>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2"><strong>Email:</strong> privacy@greenraise.com</li>
                        <li className="mb-2"><strong>Phone:</strong> +91 8048988846</li>
                        <li className="mb-2"><strong>Address:</strong> 123 Eco Street, Green City, GC 12345</li>
                        <li><strong>Website:</strong> <Link href="/contact" className="text-success text-decoration-none">Contact Form</Link></li>
                      </ul>
                    </div>

                    <p className="mt-4">
                      We are committed to addressing your privacy concerns and will respond to your inquiry as soon as possible.
                    </p>
                  </div>
                </section>

                {/* Footer */}
               
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/> 
    </div>
  );
}