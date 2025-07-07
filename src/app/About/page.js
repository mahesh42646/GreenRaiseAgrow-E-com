'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../eng/components/header';
import Footer from '../eng/components/footer';

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png",
      bio: "Passionate environmentalist with 15+ years in sustainable business development."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Head of Operations",
      image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png",
      bio: "Expert in supply chain management with focus on eco-friendly logistics."
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Product Curator",
      image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png",
      bio: "Dedicated to finding the best sustainable products for our community."
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Sustainability Director",
      image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png",
      bio: "Leading our environmental impact initiatives and partnerships."
    }
  ];

  // Company values
  const values = [
    {
      id: 1,
      title: "Environmental Stewardship",
      description: "We&apos;re committed to protecting our planet through sustainable practices and eco-friendly products.",
      icon: "bi-tree-fill"
    },
    {
      id: 2,
      title: "Community Impact",
      description: "Supporting local communities and fair trade practices across our supply chain.",
      icon: "bi-people-fill"
    },
    {
      id: 3,
      title: "Innovation",
      description: "Continuously exploring new ways to make sustainable living accessible and affordable.",
      icon: "bi-lightbulb-fill"
    },
    {
      id: 4,
      title: "Transparency",
      description: "Open and honest about our practices, sourcing, and environmental impact.",
      icon: "bi-eye-fill"
    }
  ];

  // Company stats
  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1000+", label: "Eco Products" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "500+", label: "Partner Brands" }
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <span className="badge rounded-pill text-bg-success mb-3" style={{ backgroundColor: '#08A486' }}>
                  About GreenRaise
                </span>
                <h1 className="display-4 fw-bold mb-4">
                  Making Sustainable Living
                  <span style={{ color: '#08A486' }}> Accessible</span>
                </h1>
                <p className="lead mb-4">
                  At GreenRaise, we believe that every purchase can be a step towards a greener future. 
                  Our mission is to make sustainable, eco-friendly products accessible to everyone, 
                  helping you reduce your environmental footprint without compromising on quality or style.
                </p>
                <div className="d-flex gap-3">
                  <Link href="/shop" className="btn btn-lg rounded-pill px-4" style={{ backgroundColor: '#08A486', color: 'white' }}>
                    Shop Now <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  <Link href="/contact" className="btn btn-lg btn-outline-success rounded-pill px-4" style={{ borderColor: '#08A486', color: '#08A486' }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div style={{ position: 'relative', height: '400px' }}>
                  <Image 
                    src="https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/1.jpg"
                    alt="GreenRaise Team"
                    fill
                    style={{ objectFit: 'cover', borderRadius: '15px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ backgroundColor: '#08A486' }}>
        <div className="container">
          <div className="row text-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3 mb-4">
                <div className="text-white">
                  <h2 className="display-4 fw-bold mb-2">{stat.number}</h2>
                  <p className="mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div style={{ position: 'relative', height: '400px' }}>
                <Image 
                  src="https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg"
                  alt="Our Story"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '15px' }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ps-lg-5">
                <h2 className="display-5 fw-bold mb-4">Our Story</h2>
                <p className="lead mb-4">
                  Founded in 2020, GreenRaise began as a small local initiative to promote sustainable living. 
                  What started as a passion project has grown into a trusted platform connecting conscious consumers 
                  with eco-friendly products and responsible brands.
                </p>
                <p className="mb-4">
                  We understand that making sustainable choices can sometimes feel overwhelming. That&apos;s why we&apos;ve 
                  curated a carefully selected range of products that meet our strict environmental standards while 
                  maintaining the quality and functionality you expect.
                </p>
                <div className="row">
                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ color: '#08A486' }}></i>
                      <span>Eco-friendly packaging</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ color: '#08A486' }}></i>
                      <span>Carbon-neutral shipping</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ color: '#08A486' }}></i>
                      <span>Fair trade certified</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ color: '#08A486' }}></i>
                      <span>Local partnerships</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Our Values</h2>
            <p className="lead">The principles that guide everything we do</p>
          </div>
          <div className="row g-4">
            {values.map((value) => (
              <div key={value.id} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm text-center p-4">
                  <div className="mb-3">
                    <i className={`bi ${value.icon} fs-1`} style={{ color: '#08A486' }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">{value.title}</h5>
                  <p className="text-muted mb-0">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Meet Our Team</h2>
            <p className="lead">The passionate individuals behind GreenRaise</p>
          </div>
          <div className="row g-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center">
                  <div className="position-relative">
                    <div style={{ position: 'relative', height: '250px' }}>
                      <Image 
                        src={member.image}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-1">{member.name}</h5>
                    <p className="text-muted mb-2" style={{ color: '#08A486' }}>{member.role}</p>
                    <p className="small text-muted mb-0">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5" style={{ backgroundColor: '#08A486' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="text-white">
                <h3 className="fw-bold mb-4">Our Mission</h3>
                <p className="mb-4">
                  To democratize sustainable living by making eco-friendly products accessible, 
                  affordable, and convenient for everyone. We believe that small changes in daily 
                  choices can create significant positive impact on our planet.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Reduce environmental impact through conscious consumption
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Support ethical and sustainable business practices
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Educate and inspire our community about sustainable living
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-white">
                <h3 className="fw-bold mb-4">Our Vision</h3>
                <p className="mb-4">
                  We envision a world where sustainable living is the norm, not the exception. 
                  A future where every household has access to eco-friendly alternatives that 
                  don&apos;t compromise on quality, style, or convenience.
                </p>
                <div className="row">
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="fw-bold mb-2">2025</h4>
                      <p className="small">Expand to 50+ cities nationwide</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="fw-bold mb-2">2030</h4>
                      <p className="small">Achieve carbon-neutral operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">Join Us in Making a Difference</h2>
              <p className="lead mb-4">
                Every purchase you make supports sustainable practices and helps protect our planet. 
                Start your journey towards a greener lifestyle today.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link href="/shop" className="btn btn-lg rounded-pill px-4" style={{ backgroundColor: '#08A486', color: 'white' }}>
                  Start Shopping <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link href="/contact" className="btn btn-lg btn-outline-success rounded-pill px-4" style={{ borderColor: '#08A486', color: '#08A486' }}>
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
