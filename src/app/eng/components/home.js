import { useState, useEffect } from "react";
import { productAPI } from "../../../services/api";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  // Sample data - in a real app, these would come from an API


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Featured Products: Any products (up to 4)
  const featuredProducts = products.slice(0, 8);

  // Most Popular: Bestsellers
  const popularProducts = products.filter((p) => p.isBestSeller).slice(0, 4);

  const testimonials = [
    {
      id: 1,
      name: "Anonymous Farmer",
      role: "Progressive Grower",
      text: "Since we started using their Organic Vermicompost and Humic Acid Powder, our soil health has visibly improved — crops are greener and yields have increased. The team is also very responsive to our needs.",
      avatar: "/t1.png"
    },
    {
      id: 2,
      name: "Agro Supplier",
      role: "Distributor",
      text: "Green Rise Agro’s range of Micronutrient Fertilizers and Seaweed Extract Powder helped us address nutrient deficiencies quickly. Quality packaging and timely delivery made the whole purchase experience smooth.",
      avatar: "/t1.png"
    },
    {
      id: 3,
      name: "Farm Owner",
      role: "Commercial Producer",
      text: "We’ve been sourcing NPK blends and Organic Compost from them for several months. The price is competitive and the products consistently perform well in our fields — boosting plant growth and resilience.",
      avatar: "/t1.png"
    }
    // {
    //   id: 4,
    //   name: "Agronomist",
    //   role: "Technical Advisor",
    //   text: "Excellent customer support! From helping choose the right fertilizer mix (like Potassium Fulvate 80%) to answering technical questions, the staff guided us every step of the way.",
    //   avatar: "https://themes.pixelstrap.com/fastkart/assets/images/vegetable/product/1.png"
    // }
  ];

  const faqs = [
    { id: 1, question: "Are all your products eco-friendly?", answer: "Yes, all our products are carefully selected to meet strict sustainability standards. We ensure they are made from renewable or recycled materials and have minimal environmental impact." },
    { id: 2, question: "How do you ship your products?", answer: "We use plastic-free packaging made from recycled materials. Our shipping partners are selected based on their commitment to reducing carbon emissions." },
    { id: 3, question: "Do you offer international shipping?", answer: "Yes, we ship worldwide! International shipping rates vary depending on location. We offset carbon emissions from all our shipments." },
    { id: 4, question: "What is your return policy?", answer: "We offer a 30-day return policy on all unused items. Please contact our customer service team to initiate a return." }
  ];

  // Animation utility classes
  const sectionClass = "mb-5 fade-in-section";
  const headingClass = "section-heading pt-4 pb-0 position-relative";

  return (
    <>
      <style jsx global>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
        }
        .fade-in-section.visible {
          opacity: 1;
          transform: none;
        }
        .product-card {
          transition: box-shadow 0.3s, transform 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
        }
        .product-card:hover {
          box-shadow: 0 8px 32px rgba(8,164,134,0.18);
          transform: translateY(-8px) scale(1.03);
        }
        .product-card .card-img-zoom {
          transition: transform 0.4s cubic-bezier(.4,0,.2,1);
        }
        .product-card:hover .card-img-zoom {
          transform: scale(1.08);
        }
        .section-heading {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -1px;
          color: #222;
          display: inline-block;
          padding-bottom: 0.3em;
          margin-bottom: 1.2em;
        }
        @media (max-width: 768px) {
          .section-heading { font-size: 1.5rem; }
        }
        .section-gap { margin-top: 3rem; margin-bottom: 3rem; }
      `}</style>
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.fade-in-section');
            const reveal = () => {
              for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight - 60) {
                  section.classList.add('visible');
                }
              }
            };
            window.addEventListener('scroll', reveal);
            reveal();
          });
        `
      }} />
      {/* Hero Section - Based on the image */}
      <div className="p-0" >
        <div className=" p-0">
          <div className="row g-0 p-0">
            {/* Main Hero Banner */}
            <div className="w-100 position-relative p-0">
              <div className="bg-light " >
                <div className="row" >
                  <div className="">
                    <Image src="/canva.jpg" height={500} width={1000} alt="Hero"  className="d-none" style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '777px',
                    }} />
                    <div className="position-relative p-0 d" style={{
                      backgroundImage: 'url("/Hero-Bg.png")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'right center',
                      backgroundRepeat: 'no-repeat',
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '500px',
                    }}>
                      <div className="container py-5 " >
                       
                        <h1 className=" fw-bold text-white mb-2" style={{fontSize: '3.2rem'}}>100% Organic 
                      </h1>
                        <h2 className=" fw-bold" style={{color: '#ffff', fontSize: '3.2rem'}}>     Plant Growth Regulators</h2>
                        <p className="pt-3 pb-4 text-white" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>Best quality fertilizers for your home gardening, kitchen gardening. <br/> 100% customer satisfaction with thousands of happy customers.</p>
                        <Link href="/shop" className="btn btn-lg fw-bold rounded-3 px-4 mb-5 py-2" style={{backgroundColor: '#08A485', color: '#fff'}}>
                          Shop Now <i className="bi bi-arrow-right ms-2 fw-bold"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className=" ">
        {/* Categories Section - Based on the image */}
        <section className="  container py-5">
          <h2 className="fw-bold py-2">Categories</h2>
          <div className="row pb-3">
            <div className="col-md-6 col-lg-4 py-lg-0 py-2 ">
              <div className="p-0" style={{ position: 'relative', height: '100%', width: '100%' }}>
                <Image className="p-0 rounded-4 shadow-sm" src="/1.jpg" alt="category" height={200} width={200}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
              </div>
            </div>

            <div className="col-md-6 col-lg-4 py-lg-0 py-2 ">
              <div className="p-0" style={{ position: 'relative', height: '100%', width: '100%' }}>
                <Image className="p-0 rounded-4 shadow-sm" src="/2.jpg" alt="category" height={200} width={200}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
              </div>
            </div>

            <div className="col-md-6 col-lg-4 py-lg-0 py-2 ">
              <div className="p-0" style={{ position: 'relative', height: '100%', width: '100%' }}>
                <Image className="p-0 rounded-4 shadow-sm" src="/3.jpg" alt="category" height={200} width={200}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
              </div>
            </div>


          </div>
        </section>

        {/* Featured Products */}
        <section className=" section- bg-light py-5">
          <div className="container py-3 ">
            <div className="d-flex pb-2 justify-content-between align-items-center ">
              <h2 className="fw-bold my-auto">Featured Products</h2>
              <Link href="/shop" className="text-decoration-none my-auto fw-bold shadow-sm btn" style={{ color: '#08A486' }}>View All <i className="bi bi-arrow-right ms-2"></i></Link>
            </div>
            <div className="row   rounded-4 p-0 ">
              {featuredProducts.map(product => (
                <div key={product.productId} className="col-6 rounded-4 p-3  col-md-3">
                  <div className=" h-100 shadow-sm  position-relative bg-white py- px-3 rounded-4  ">
                    <div className="badge bg-success position-absolute top-0 end-0 " style={{ backgroundColor: '#08A486', zIndex: 1000 }}>Featured</div>
                    <div style={{ position: 'relative', height: '280px' }}>
                      <Image
                        src={product.productImage || "https://via.placeholder.com/300"}
                        alt={product.productName || "Product"}
                        fill
                        className="card-img-zoom p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="py-3">
                      <h5 className="fw-bold" style={{fontSize: '1rem'}}>{product.productName || "Unnamed Product"}</h5>
                      <div className="d-flex justify-content-between align-items-center">
                      <div>
                      {product.discountedPrice ? (
                          <>
                            <span className="fw-bold pe-2" style={{color: '#08A486', fontSize: '1rem'}}>₹{product.discountedPrice.toFixed(1)}</span>
                            <span className="text-muted text-decoration-line-through" style={{fontSize: '0.8rem'}}>₹{product.actualPrice.toFixed(1)}</span>
                          </>
                        ) : (
                          <span className="fw-bold">₹{product.actualPrice ? product.actualPrice.toFixed(2) : "N/A"}</span>
                        )}
                        
                      </div>
                        <div>
                          <i className="bi bi-star-fill text-warning"></i>
                          <span className="ms-1">{product.averageRating}</span>
                        </div>
                      </div>
                      <p className="card-text  mb-2 mt-2">{product.shortDescription ? product.shortDescription.substring(0, 30) + "..." : "No description available."}</p>
                      <div className="card-footer bg-white ">
                      <Link href={`/product-details/${product.productId}`} className="btn rounded-3 w-100" style={{ borderColor: '#08A486', color: '#08A486' }}>
                        View Product
                      </Link>
                    </div>
                    </div>
                   
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Testimonials */}
        <section className=" py-5 ">

          <div className="container py-3">
            <div className="  py-2">
              <h2 className="fw-bold">What Our Customers Say</h2>
              {/* <p className="text-muted">Join thousands of satisfied customers who have made the switch to sustainable living</p> */}
            </div>
            <div className="row g-4 ">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="col-md-4 ">
                  <div className="card h-100 shadow-sm border">
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-quote fs-1 text-success" style={{ color: '#08A486' }}></i>
                      </div>
                      <p className="card-text ">{testimonial.text}</p>
                      <div className="d-flex justify-content-center align-items-center">
                        <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="rounded-circle"
                            style={{ objectFit: 'cover'}}
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
          </div>
        </section>

        {/* Contact Section */}
        <section className="  bg-light py-5 ">
          <div className="row mx-auto g-3 align-items-center py-3  container">
            <div className="col-md-6">
              <div className=" py-3">
                <h2 className="">Get in Touch</h2>
                <p className="">Have questions about our products or sustainability practices? We&apos;d love to hear from you!</p>
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
        <section className=" container py-5">
          <h2 className="fw-bold py-2">Why Choose Us</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-4 h-100 border rounded-4 shadow-sm bg-white animate__animated animate__fadeInUp">
                <i className="bi bi-globe2 fs-1 mb-3 text-success"></i>
                <h5 className="fw-bold mb-2">Eco Commitment</h5>
                <p>All our products are vetted for sustainability, so you can shop with confidence and make a real difference.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 h-100 border rounded-4 shadow-sm bg-white animate__animated animate__fadeInUp animate__delay-1s">
                <i className="bi bi-people fs-1 mb-3 text-success"></i>
                <h5 className="fw-bold mb-2">Community Focus</h5>
                <p>We support local artisans and eco-initiatives, building a greener future together with our customers.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 h-100 border rounded-4 shadow-sm bg-white animate__animated animate__fadeInUp animate__delay-2s">
                <i className="bi bi-truck fs-1 mb-3 text-success"></i>
                <h5 className="fw-bold mb-2">Fast, Green Delivery</h5>
                <p>Enjoy quick, reliable shipping in plastic-free packaging, with carbon offset for every order.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className=" bg-light py-5">
          <div className="container">
            <h2 className="fw-bold py-2">Who We Are</h2>
            <div className="row ">

              <div className="col-md-  p-2">
                <h4 className="fw-bold mb-3" style={{ color: '#08A486' }}>Empowering Sustainable Choices</h4>
                <p className="lead">GreenRaise is a passionate team dedicated to making eco-friendly living accessible and enjoyable for everyone. We carefully curate products that are good for you and the planet, and we believe in transparency, quality, and community impact.</p>
                <p className="lead">GreenRaise is a passionate team dedicated to making eco-friendly living accessible and enjoyable for everyone. We carefully curate products that are good for you and the planet, and we believe in transparency, quality, and community impact.</p>
              </div>
              {/* <div className="col-md-6 mb-4 mb-md-0 border">
                <Image src="/globe.svg" alt="Who We Are" width={400} height={300} style={{ objectFit: 'contain' }} />
              </div> */}
            </div>
          </div>
        </section>

        <section className=" container py-5">
          <div className=" py-2">
            <h2 className="fw-bold">Frequently Asked Questions</h2>
          </div>
          <div className="accordion" id="faqCustomAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item mb-4 border-0" key={faq.id}>
                <h2 className="accordion-header" id={`faqCustomHeading${faq.id}`}>
                  <button
                    className={`accordion-button d-flex justify-content-between align-items-center text-dark fw-bold  px-4 py-3 ${index !== 0 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faqCustomCollapse${faq.id}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`faqCustomCollapse${faq.id}`}
                    style={{
                      background: "linear-gradient(45deg,rgb(242, 242, 242) 90%,rgb(59, 198, 168) 80%)",
                      
                      fontSize: "1.15rem",
                      borderRadius: 0,
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    {faq.question}
                
                  </button>
                </h2>
                <div
                  id={`faqCustomCollapse${faq.id}`}
                  className={`accordion-collapse collapse${index === 0 ? " show" : ""}`}
                  aria-labelledby={`faqCustomHeading${faq.id}`}
                  data-bs-parent="#faqCustomAccordion"
                >
                  <div
                    className="accordion-body px-4 py-4"
                    style={{
                      fontSize: "1.08rem",
                      borderBottom: "3px solid #08A485",
                      background: "#fff",
                    }}
                  >
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