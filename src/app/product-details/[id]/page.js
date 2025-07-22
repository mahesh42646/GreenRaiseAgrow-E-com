'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../eng/components/header';
import Footer from '../../eng/components/footer';
import { productAPI } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState({ name: '', email: '', question: '' });
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 0, review: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [faqEditIdx, setFaqEditIdx] = useState(null);
  const [faqSubmitting, setFaqSubmitting] = useState(false);
  const [faqError, setFaqError] = useState('');
  const [faqSuccess, setFaqSuccess] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [questionSuccess, setQuestionSuccess] = useState('');
  const [answerSubmitting, setAnswerSubmitting] = useState({});

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await productAPI.getProductById(id);
        // Build gallery: productImage as first, then media images/videos
        let gallery = [];
        if (productData.productImage) gallery.push(productData.productImage);
        if (Array.isArray(productData.media)) {
          gallery = gallery.concat(productData.media.filter(m => m.type === 'image').map(m => m.url));
        }
        setProduct({
          ...productData,
          gallery,
        });
        setFaqs(productData.faqs || []);
        // Fetch questions
        try {
          const q = await productAPI.getQuestions(id);
          setQuestions(q || []);
        } catch {}
        // Fetch related products
        try {
          const allProducts = await productAPI.getAllProducts();
          const related = allProducts
            .filter(p => p.productId !== id && p.productCategory === productData.productCategory)
            .slice(0, 4)
            .map(p => ({
              id: p.productId,
              name: p.productName,
              price: p.actualPrice,
              discountedPrice: p.discountedPrice,
              image: p.productImage || (p.media && p.media[0]?.url) || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(p.productName)
            }));
          setRelatedProducts(related);
        } catch {}
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleAddToWishlist = () => {
    // In a real app, this would add the product to a wishlist context/state
    alert(`Added ${product.name} to wishlist!`);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  // FAQ handlers
  const handleFaqFormChange = (e) => {
    setFaqForm({ ...faqForm, [e.target.name]: e.target.value });
  };
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    setFaqSubmitting(true);
    setFaqError('');
    setFaqSuccess('');
    try {
      if (faqEditIdx !== null) {
        // Edit
        const faq = faqs[faqEditIdx];
        await productAPI.updateFaq(id, faq._id || faq.faqId, faqForm);
        setFaqSuccess('FAQ updated.');
      } else {
        // Add
        await productAPI.addFaq(id, faqForm);
        setFaqSuccess('FAQ added.');
      }
      // Refresh
      const updated = await productAPI.getProductById(id);
      setFaqs(updated.faqs || []);
      setFaqForm({ question: '', answer: '' });
      setFaqEditIdx(null);
    } catch (err) {
      setFaqError(err.message || 'Failed to save FAQ');
    } finally {
      setFaqSubmitting(false);
    }
  };
  const handleFaqEdit = (idx) => {
    setFaqEditIdx(idx);
    setFaqForm({ question: faqs[idx].question, answer: faqs[idx].answer });
  };
  const handleFaqDelete = async (faqId) => {
    if (!window.confirm('Delete this FAQ?')) return;
    setFaqSubmitting(true);
    setFaqError('');
    try {
      await productAPI.deleteFaq(id, faqId);
      const updated = await productAPI.getProductById(id);
      setFaqs(updated.faqs || []);
    } catch (err) {
      setFaqError(err.message || 'Failed to delete FAQ');
    } finally {
      setFaqSubmitting(false);
    }
  };

  // Question handlers
  const handleQuestionFormChange = (e) => {
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });
  };
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setQuestionSubmitting(true);
    setQuestionError('');
    setQuestionSuccess('');
    try {
      await productAPI.addQuestion(id, questionForm);
      setQuestionSuccess('Question submitted!');
      setQuestionForm({ name: '', email: '', question: '' });
      const q = await productAPI.getQuestions(id);
      setQuestions(q || []);
    } catch (err) {
      setQuestionError(err.message || 'Failed to submit question');
    } finally {
      setQuestionSubmitting(false);
    }
  };
  const handleAnswerChange = (qid, value) => {
    setQuestions(questions.map(q => q._id === qid || q.questionId === qid ? { ...q, answer: value } : q));
  };
  const handleAnswerSubmit = async (qid, answer) => {
    setAnswerSubmitting(s => ({ ...s, [qid]: true }));
    try {
      await productAPI.answerQuestion(id, qid, answer);
      const q = await productAPI.getQuestions(id);
      setQuestions(q || []);
    } catch {}
    setAnswerSubmitting(s => ({ ...s, [qid]: false }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product information...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <h1 className="mb-4">Product Not Found</h1>
          <p>{error || 'Sorry, the product you are looking for does not exist.'}</p>
          <Link href="/shop" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
            Return to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb bg-white px-0">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop" className="text-decoration-none">Shop</Link>
            </li>
            <li className="breadcrumb-item">
              {product.productCategory ? (
                <Link href={`/shop?category=${encodeURIComponent(product.productCategory)}`} className="text-decoration-none">
                  {product.productCategory}
                </Link>
              ) : (
                <span>Category</span>
              )}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="row g-4 mb-4">
          {/* Images */}
          <div className="col-lg-7">
            <div className="border rounded-3 bg-white p-3 mb-2 text-center">
              <Image
                src={Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery[selectedImage] : 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="img-fluid rounded"
                width={720}
                height={720}
                unoptimized={true}
                style={{ objectFit: 'contain', maxHeight: 720 }}
              />
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {(Array.isArray(product.gallery) ? product.gallery : []).map((image, index) => (
                <div key={index} className={`border rounded-2 p-1 ${selectedImage === index ? 'border-primary' : 'border-light'}`} 
                style={{ cursor: 'pointer', width: 110, height: 110, background: '#fff' }} onClick={() => handleImageClick(index)}>
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className=" rounded"
                    width={100}
                    height={100}
                    unoptimized={true}
                    style={{ objectFit: 'contain', width: 100, height: 100 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info & Buy Box */}
          <div className="col-lg-5">
            <h2 className="mb-2" style={{ fontWeight: 600 }}>{product.name}</h2>
            <div className="mb-2">
              <span className="fs-5 text-warning">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`bi ${i < Math.round(product.averageRating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                ))}
              </span>
              <span className="ms-2 text-muted">{product.reviewCount || 0} ratings</span>
            </div>
            <div className="mb-2">
              <span className="fs-3 fw-bold text-success">₹{typeof product.discountedPrice === 'number' ? product.discountedPrice.toFixed(2) : product.actualPrice?.toFixed(2) || 'N/A'}</span>
              {product.discountedPrice && product.actualPrice && (
                <span className="ms-2 text-muted text-decoration-line-through">₹{product.actualPrice.toFixed(2)}</span>
              )}
              {product.discountedPrice && product.actualPrice && (
                <span className="badge bg-danger ms-2 align-middle">{Math.round((1 - product.discountedPrice / product.actualPrice) * 100)}% OFF</span>
              )}
            </div>
            <div className="mb-2">
              <span className="fw-bold">Stock:</span> {product.stock > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out of Stock</span>}
            </div>
            <div className="mb-2">
              <span className="fw-bold">SKU:</span> {product.sku || 'N/A'}
            </div>
            <div className="mb-2">
              <span className="fw-bold">Categories:</span> {
                Array.isArray(product.categories) && product.categories.length > 0
                  ? product.categories.join(', ')
                  : [product.productCategory, product.productSubcategory].filter(Boolean).join(', ') || 'N/A'
              }
            </div>
            <div className="mb-2">
              <span className="fw-bold">Tags:</span> {
                Array.isArray(product.tags) && product.tags.length > 0
                  ? product.tags.join(', ')
                  : Array.isArray(product.productTags) && product.productTags.length > 0
                    ? product.productTags.join(', ')
                    : 'N/A'
              }
            </div>
            {/* Short Description */}
            {product.shortDescription && <div className="mb-3"><span className="fw-bold">About this item:</span> <span>{product.shortDescription}</span></div>}
            <div className="d-flex align-items-center mb-3">
              <span className="me-2">Quantity:</span>
              <div className="input-group" style={{ width: 120 }}>
                <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(quantity - 1)}><i className="bi bi-dash"></i></button>
                <input type="text" className="form-control text-center" value={quantity} readOnly />
                <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(quantity + 1)}><i className="bi bi-plus"></i></button>
              </div>
            </div>
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-lg w-50" style={{ backgroundColor: '#08A486', color: 'white' }} onClick={handleAddToCart}><i className="bi bi-cart-plus me-2"></i>Add to Cart</button>
              <button className="btn btn-lg btn-outline-danger w-25" onClick={handleAddToWishlist}><i className="bi bi-heart"></i></button>
            </div>
            <div className="mb-2">
              <i className="bi bi-truck me-2"></i>Free shipping on orders over ₹500
            </div>
            <div className="mb-2">
              <i className="bi bi-arrow-repeat me-2"></i>30-day returns
            </div>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-facebook me-1"></i>Share</button>
              <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-twitter me-1"></i>Tweet</button>
              <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-pinterest me-1"></i>Pin</button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="row mb-4">
          <div className="col-lg-9">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-3">Product Description</h4>
                <p>{product.longDescription || product.description || 'No description available.'}</p>
                <h5 className="mb-2">Key Features</h5>
                <ul>
                  {Array.isArray(product.features) && product.features.length > 0
                    ? product.features.map((feature, index) => <li key={index}>{feature}</li>)
                    : Array.isArray(product.productTags) && product.productTags.length > 0
                      ? product.productTags.map((tag, index) => <li key={index}>{tag}</li>)
                      : <li>No features listed.</li>
                  }
                </ul>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-3">Specifications</h4>
                {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                  <table className="table table-bordered">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <th style={{ width: '30%' }}>{spec.name}</th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div className="text-muted">No specifications listed.</div>}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-3">Customer Reviews</h4>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review.reviewId} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold">{review.reviewerName}</span>
                        <span className="text-muted small">{new Date(review.reviewDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-1">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`} style={{ color: '#ffc107' }}></i>
                        ))}
                      </div>
                      <div>{review.reviewText}</div>
                    </div>
                  ))
                ) : <div className="alert alert-info">No reviews yet. Be the first to review this product!</div>}
                {/* Add Review Form */}
                <div className="mt-4">
                  <h5 className="mb-2">Write a Review</h5>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setReviewSubmitting(true);
                    try {
                      await productAPI.addReview(id, {
                        reviewerName: reviewForm.name,
                        reviewerEmail: reviewForm.email,
                        rating: reviewForm.rating,
                        reviewText: reviewForm.review,
                        reviewDate: new Date().toISOString(),
                      });
                      setReviewForm({ name: '', email: '', rating: 0, review: '' });
                      const updated = await productAPI.getProductById(id);
                      setProduct({ ...updated, gallery: product.gallery });
                    } catch {
                      // handle error
                    }
                    setReviewSubmitting(false);
                  }}>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Your Name*" value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div className="col-md-4">
                        <input type="email" className="form-control" placeholder="Your Email*" value={reviewForm.email} onChange={e => setReviewForm(f => ({ ...f, email: e.target.value }))} required />
                      </div>
                      <div className="col-md-4 d-flex align-items-center">
                        <span className="me-2">Rating*</span>
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < reviewForm.rating ? 'bi-star-fill' : 'bi-star'}`}
                            style={{ color: '#ffc107', cursor: 'pointer', fontSize: 22 }}
                            onClick={() => setReviewForm(f => ({ ...f, rating: i + 1 }))}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="row g-2 mt-2">
                      <div className="col-12">
                        <textarea className="form-control" placeholder="Your Review*" rows={3} value={reviewForm.review} onChange={e => setReviewForm(f => ({ ...f, review: e.target.value }))} required></textarea>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button type="submit" className="btn btn-success" disabled={reviewSubmitting}>Submit Review</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-3">Frequently Asked Questions</h4>
                {faqs.length === 0 && <div className="alert alert-info">No FAQs for this product yet.</div>}
                <div className="accordion" id="faqAccordion">
                  {faqs.map((faq, idx) => (
                    <div key={faq._id || faq.faqId || idx} className="accordion-item">
                      <h2 className="accordion-header" id={`faqHeading${idx}`}>
                        <button className={`accordion-button ${idx !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faqCollapse${idx}`} aria-expanded={idx === 0 ? 'true' : 'false'} aria-controls={`faqCollapse${idx}`}>{faq.question}</button>
                      </h2>
                      <div id={`faqCollapse${idx}`} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} aria-labelledby={`faqHeading${idx}`} data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                          {faq.answer}
                          {user?.role === 'admin' && (
                            <div className="mt-2 d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleFaqEdit(idx)}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleFaqDelete(faq._id || faq.faqId)}>Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {user?.role === 'admin' && (
                  <div className="mt-4">
                    <h5>{faqEditIdx !== null ? 'Edit FAQ' : 'Add FAQ'}</h5>
                    {faqError && <div className="alert alert-danger">{faqError}</div>}
                    {faqSuccess && <div className="alert alert-success">{faqSuccess}</div>}
                    <form onSubmit={handleFaqSubmit} className="row g-2 align-items-end">
                      <div className="col-md-5">
                        <label className="form-label">Question</label>
                        <input type="text" className="form-control" name="question" value={faqForm.question} onChange={handleFaqFormChange} required />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label">Answer</label>
                        <input type="text" className="form-control" name="answer" value={faqForm.answer} onChange={handleFaqFormChange} required />
                      </div>
                      <div className="col-md-2">
                        <button type="submit" className="btn btn-success w-100" disabled={faqSubmitting}>{faqEditIdx !== null ? 'Update' : 'Add'}</button>
                      </div>
                    </form>
                    {faqEditIdx !== null && <button className="btn btn-link mt-2" onClick={() => { setFaqEditIdx(null); setFaqForm({ question: '', answer: '' }); }}>Cancel Edit</button>}
                  </div>
                )}
              </div>
            </div>

            {/* Questions Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-3">Customer Questions & Answers</h4>
                {questions.length === 0 && <div className="alert alert-info">No questions yet. Be the first to ask!</div>}
                <div className="list-group mb-4">
                  {questions.map((q, idx) => (
                    <div key={q._id || q.questionId || idx} className="list-group-item">
                      <div className="fw-bold">Q: {q.question}</div>
                      <div className="text-muted small">by {q.name || 'Anonymous'}</div>
                      {q.answer ? (
                        <div className="mt-2"><span className="fw-bold">A:</span> {q.answer}</div>
                      ) : user?.role === 'admin' ? (
                        <form className="mt-2 d-flex gap-2 align-items-center" onSubmit={e => { e.preventDefault(); handleAnswerSubmit(q._id || q.questionId, q.answer); }}>
                          <input type="text" className="form-control" value={q.answer || ''} onChange={e => handleAnswerChange(q._id || q.questionId, e.target.value)} placeholder="Type answer..." required />
                          <button type="submit" className="btn btn-primary btn-sm" disabled={answerSubmitting[q._id || q.questionId]}>Submit</button>
                        </form>
                      ) : (
                        <div className="mt-2 text-muted">No answer yet.</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="card p-3">
                  <h5>Ask a Question</h5>
                  {questionError && <div className="alert alert-danger">{questionError}</div>}
                  {questionSuccess && <div className="alert alert-success">{questionSuccess}</div>}
                  <form onSubmit={handleQuestionSubmit} className="row g-2 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Your Name</label>
                      <input type="text" className="form-control" name="name" value={questionForm.name} onChange={handleQuestionFormChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Your Email</label>
                      <input type="email" className="form-control" name="email" value={questionForm.email} onChange={handleQuestionFormChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Question</label>
                      <input type="text" className="form-control" name="question" value={questionForm.question} onChange={handleQuestionFormChange} required />
                    </div>
                    <div className="col-12 mt-2">
                      <button type="submit" className="btn btn-success" disabled={questionSubmitting}>Submit Question</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Side Related Products */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="mb-3">Related Products</h5>
                {relatedProducts.length > 0 ? (
                  relatedProducts.map(product => (
                    <div key={product.id} className="mb-3 pb-3 border-bottom">
                      <Link href={`/product-details/${product.id}`} className="text-decoration-none d-flex align-items-center gap-2">
                        <Image src={product.image} alt={product.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} />
                        <div>
                          <div className="fw-bold small">{product.name}</div>
                          <div className="text-success small">₹{product.discountedPrice || product.price}</div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : <div className="text-muted">No related products found.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
