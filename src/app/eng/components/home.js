import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  // Sample data - in a real app, these would come from an API
  const categories = [
    { id: 1, name: "Hot Deals on New Items", subtitle: "Daily Essentials Eggs & Dairy", image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png", discount: "5% OFF" },
    { id: 2, name: "Buy More & Save More", subtitle: "Fresh Vegetables", image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png", discount: "5% OFF" },
    { id: 3, name: "Organic Meat Prepared", subtitle: "Delivered to Your Home", image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png", discount: "5% OFF" },
    { id: 4, name: "Buy More & Save More", subtitle: "Nuts & Snacks", image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png", discount: "5% OFF" }
  ];

  const featuredProducts = [
    { id: 1, name: "Bamboo Toothbrush", price: 12.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.8 },
    { id: 2, name: "Reusable Water Bottle", price: 24.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.9 },
    { id: 3, name: "Organic Cotton Tote", price: 18.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.7 },
    { id: 4, name: "Beeswax Food Wraps", price: 15.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.6 }
  ];

  const popularProducts = [
    { id: 5, name: "Solar Power Bank", price: 39.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.9 },
    { id: 6, name: "Recycled Paper Journal", price: 9.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.5 },
    { id: 7, name: "Bamboo Cutlery Set", price: 14.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.7 },
    { id: 8, name: "Organic Soap Bar", price: 7.99, image: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg", rating: 4.8 }
  ];

  const testimonials = [
    { id: 1, name: "Sarah Johnson", role: "Eco Enthusiast", text: "GreenRaise has completely transformed how I shop for everyday items. Their products are not only sustainable but also high quality!", avatar: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png" },
    { id: 2, name: "Michael Chen", role: "Environmental Activist", text: "I love that I can find all my eco-friendly essentials in one place. The customer service is exceptional too!", avatar: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png" },
    { id: 3, name: "Emma Wilson", role: "Sustainable Living Blogger", text: "As someone who writes about sustainable living, I can confidently say GreenRaise offers some of the best eco-products on the market.", avatar: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png" }
  ];

  const faqs = [
    { id: 1, question: "Are all your products eco-friendly?", answer: "Yes, all our products are carefully selected to meet strict sustainability standards. We ensure they are made from renewable or recycled materials and have minimal environmental impact." },
    { id: 2, question: "How do you ship your products?", answer: "We use plastic-free packaging made from recycled materials. Our shipping partners are selected based on their commitment to reducing carbon emissions." },
    { id: 3, question: "Do you offer international shipping?", answer: "Yes, we ship worldwide! International shipping rates vary depending on location. We offset carbon emissions from all our shipments." },
    { id: 4, question: "What is your return policy?", answer: "We offer a 30-day return policy on all unused items. Please contact our customer service team to initiate a return." }
  ];

  return (
    <>
      {/* Hero Section - Based on the image */}
      <div className="container p-0">
        <div className="row g-0">
          {/* Main Hero Banner */}
          <div className="col-lg-8 position-relative">
            <div className="bg-light " style={{ minHeight: "400px" }}>
              <div className="row">
                <div className="">
                  <div className="position-relative p-5" style={{
                    backgroundImage: 'url(https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/1.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div className="p" style={{
                      borderRadius: '10px',
                      maxWidth: '500px'
                    }}>
                      <span className="badge rounded-pill text-bg-danger mb-2">Exclusive offer</span>
                      <span className="badge rounded-pill text-bg-warning ms-2 mb-2">30% Off</span>
                      <h1 className="display-5 fw-bold mb-3">STAY HOME &<br />DELIVERED YOUR</h1>
                      <h2 className="display-6 fw-bold text-success mb-4">DAILY NEEDS</h2>
                      <p className="mb-4">Vegetables contain many vitamins and minerals that are good for your health.</p>
                      <Link href="/shop" className="btn btn-danger rounded-pill px-4 py-2">
                        Shop Now <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Side Banners */}
          <div className="col-lg-4">
            <div className="row g-0">
              {/* Nut Collection Banner */}
              <div className="col-12 mb-3">
                <div className="position-relative" style={{ minHeight: "200px" }}>
                  <div className="position-relative p-3" style={{
                    backgroundImage: 'url(https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/2.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div className="p-3" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '10px',
                      maxWidth: '100%'
                    }}>
                      <h3 className="text-danger mb-1">45% <span className="fs-5">OFF</span></h3>
                      <h4 className="text-success mb-3">Nut Collection</h4>
                      <p className="small mb-3">We deliver organic vegetables & fruits</p>
                      <Link href="/shop" className="btn btn-sm btn-outline-dark">
                        Shop Now <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Healthy Food Banner */}
              <div className="col-12">
                <div className="bg-light p-3 position-relative" style={{ minHeight: "200px" }}>
                  <div className="position-relative p-3" style={{
                    backgroundImage: 'url(https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/3.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div className="p-3" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '10px',
                      maxWidth: '100%'
                    }}>
                      <h4 className="text-success mb-1">Healthy Food</h4>
                      <h5 className="text-danger mb-3">Organic Market</h5>
                      <p className="small mb-3">Start your daily shopping with some...</p>
                      <Link href="/shop" className="btn btn-sm btn-outline-dark">
                        Shop Now <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        {/* Categories Section - Based on the image */}
        <section className="mb-5">
          <div className="row g-4">
            {categories.map(category => (
              <div key={category.id} className="col-md-6 col-lg-3">
                <div className="card border-0 rounded-3 overflow-hidden">
                  <div className="position-relative">
                    <div className="position-absolute top-0 start-0 p-3">
                      <span className="badge bg-danger">{category.discount}</span>
                    </div>
                    <div style={{ position: 'relative', height: '200px' }}>
                      <Image 
                        src={category.image} 
                        alt={category.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="card-img-overlay d-flex flex-column justify-content-end">
                      <div className="bg-white bg-opacity-75 p-3 rounded-3">
                        <h5 className="card-title mb-1">{category.name}</h5>
                        <p className="card-text mb-2">{category.subtitle}</p>
                        <Link href="/shop" className="btn btn-sm rounded-pill" style={{ backgroundColor: category.id % 2 === 0 ? '#FF6B6B' : '#08A486', color: 'white' }}>
                          Shop Now <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Featured Products</h2>
            <Link href="/shop" className="text-decoration-none" style={{ color: '#08A486' }}>View All</Link>
          </div>
          <div className="row g-4">
            {featuredProducts.map(product => (
              <div key={product.id} className="col-6 col-md-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="badge bg-success position-absolute top-0 end-0 m-2" style={{ backgroundColor: '#08A486' }}>Featured</div>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">${product.price}</span>
                      <div>
                        <i className="bi bi-star-fill text-warning"></i>
                        <span className="ms-1">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <Link href={`/product-details/${product.id}`} className="btn btn-outline-success w-100" style={{ borderColor: '#08A486', color: '#08A486' }}>
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Most Popular</h2>
            <Link href="/shop" className="text-decoration-none" style={{ color: '#08A486' }}>View All</Link>
          </div>
          <div className="row g-4">
            {popularProducts.map(product => (
              <div key={product.id} className="col-6 col-md-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="badge bg-danger position-absolute top-0 end-0 m-2">Popular</div>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">${product.price}</span>
                      <div>
                        <i className="bi bi-star-fill text-warning"></i>
                        <span className="ms-1">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <Link href={`/product-details/${product.id}`} className="btn btn-outline-success w-100" style={{ borderColor: '#08A486', color: '#08A486' }}>
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-5 py-5 bg-light">
          <div className="text-center mb-5">
            <h2>What Our Customers Say</h2>
            <p className="text-muted">Join thousands of satisfied customers who have made the switch to sustainable living</p>
          </div>
          <div className="row g-4">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-quote fs-1 text-success" style={{ color: '#08A486' }}></i>
                    </div>
                    <p className="card-text mb-4">{testimonial.text}</p>
                    <div className="d-flex justify-content-center align-items-center">
                      <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          fill
                          className="rounded-circle"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="text-start ms-3">
                        <h6 className="mb-0">{testimonial.name}</h6>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-5">
          <div className="row g-0 align-items-center">
            <div className="col-md-6">
              <div className="p-4 p-md-5">
                <h2 className="mb-4">Get in Touch</h2>
                <p className="mb-4">Have questions about our products or sustainability practices? We&apos;d love to hear from you!</p>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Your Email" required />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" rows="4" placeholder="Your Message" required></textarea>
                  </div>
                  <button type="submit" className="btn btn-success" style={{ backgroundColor: '#08A486' }}>Send Message</button>
                </form>
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block">
              <div style={{ position: 'relative', height: '400px' }}>
                <Image 
                  src="https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/1.jpg" 
                  alt="Contact us"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-5">
          <div className="text-center mb-5">
            <h2>Frequently Asked Questions</h2>
            <p className="text-muted">Find answers to common questions about our products and services</p>
          </div>
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="accordion-item">
                <h2 className="accordion-header" id={`heading${faq.id}`}>
                  <button 
                    className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapse${faq.id}`} 
                    aria-expanded={index === 0 ? 'true' : 'false'} 
                    aria-controls={`collapse${faq.id}`}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div 
                  id={`collapse${faq.id}`} 
                  className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                  aria-labelledby={`heading${faq.id}`} 
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}