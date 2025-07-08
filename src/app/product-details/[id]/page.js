'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../eng/components/header';
import Footer from '../../eng/components/footer';
import { productAPI } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import Image from 'next/image'; 
export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await productAPI.getProductById(id);
        setProduct({
          id: productData.productId,
          name: productData.productName,
          price: productData.actualPrice,
          discountedPrice: productData.discountedPrice,
          rating: productData.averageRating || 4.5,
          reviewCount: productData.reviewCount || 0,
          description: productData.shortDescription,
          longDescription: productData.longDescription,
          features: productData.productTags.map(tag => `${tag} feature`),
          specifications: [
            { name: 'Weight', value: '2.5 lbs (1.13 kg)' },
            { name: 'Dimensions', value: '8" x 5" x 3" (20.3 x 12.7 x 7.6 cm)' },
            { name: 'Form', value: 'Granular' },
            { name: 'SKU', value: productData.skuNo },
            { name: 'Category', value: productData.productCategory },
            { name: 'Subcategory', value: productData.productSubcategory }
          ],
          stock: productData.quantity,
          sku: productData.skuNo,
          categories: [productData.productCategory, productData.productSubcategory],
          tags: productData.productTags,
          images: productData.productImage && productData.productImage.length > 0 
            ? productData.productImage 
            : ['https://via.placeholder.com/600x600?text=' + encodeURIComponent(productData.productName)],
          reviews: productData.reviews || []
        });

        // Fetch related products
        try {
          const allProducts = await productAPI.getAllProducts();
          // Filter related products by category
          const related = allProducts
            .filter(p => p.productId !== id && p.productCategory === productData.productCategory)
            .slice(0, 4)
            .map(p => ({
              id: p.productId,
              name: p.productName,
              price: p.actualPrice,
              discountedPrice: p.discountedPrice,
              image: p.productImage && p.productImage.length > 0 
                ? p.productImage[0] 
                : 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(p.productName)
            }));
          
          setRelatedProducts(related);
        } catch (err) {
          console.error('Error fetching related products:', err);
          // Use empty array if related products fail to load
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
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
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop" className="text-decoration-none">Shop</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/shop?category=${product.categories[0]}`} className="text-decoration-none">
                {product.categories[0]}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="row mb-5">
          {/* Product Images */}
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card border-0">
              <Image 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="card-img-top img-fluid rounded"
                width={50}
                height={50}
                unoptimized={true}
              />
              <div className="row mt-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="col-3">
                    <Image 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className={`img-fluid rounded cursor-pointer ${selectedImage === index ? 'border border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(index)}
                      width={50}
                      height={50}
                      unoptimized={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <h1 className="mb-2">{product.name}</h1>
            
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i}
                      className={`bi ${i < Math.floor(product.rating) ? 'bi-star-fill' : i < product.rating ? 'bi-star-half' : 'bi-star'}`}
                      style={{ color: '#ffc107' }}
                    ></i>
                  ))}
                </div>
                <span className="text-muted">({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="mb-3">
              {product.discountedPrice ? (
                <div className="d-flex align-items-center">
                  <h3 className="mb-0 me-2">${product.discountedPrice.toFixed(2)}</h3>
                  <span className="text-muted text-decoration-line-through">${product.price.toFixed(2)}</span>
                  <span className="badge bg-danger ms-2">
                    {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <h3 className="mb-0">${product.price.toFixed(2)}</h3>
              )}
            </div>
            
            <div className="mb-4">
              <p>{product.description}</p>
            </div>
            
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <span className="me-3">Quantity:</span>
                <div className="input-group" style={{ width: '150px' }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input 
                    type="text" 
                    className="form-control text-center" 
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) handleQuantityChange(val);
                    }}
                    readOnly
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-lg" 
                  style={{ backgroundColor: '#08A486', color: 'white' }}
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>
                <button 
                  className="btn btn-lg btn-outline-danger"
                  onClick={handleAddToWishlist}
                >
                  <i className="bi bi-heart"></i>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-truck me-2"></i>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-arrow-repeat me-2"></i>
                <span>30-day returns</span>
              </div>
            </div>
            
            <div className="mb-3">
              <div><strong>SKU:</strong> {product.sku}</div>
              <div>
                <strong>Categories:</strong> {product.categories.join(', ')}
              </div>
              <div>
                <strong>Tags:</strong> {product.tags.join(', ')}
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-facebook me-1"></i>
                Share
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-twitter me-1"></i>
                Tweet
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-pinterest me-1"></i>
                Pin
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-white">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.reviews.length})
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body p-4">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div>
                <p className="mb-4">{product.longDescription}</p>
                
                <h5 className="mb-3">Key Features</h5>
                <ul className="mb-0">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="table-responsive">
                <table className="table table-striped">
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <th style={{ width: '30%' }}>{spec.name}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="mb-4">
                  <h5 className="mb-3">Customer Reviews</h5>
                  {product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                      <div key={review.reviewId} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="mb-0">{review.reviewerName}</h6>
                            <span className="text-muted small">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i}
                                className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                                style={{ color: '#ffc107' }}
                              ></i>
                            ))}
                          </div>
                          <p className="mb-0">{review.reviewText}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="alert alert-info">
                      No reviews yet. Be the first to review this product!
                    </div>
                  )}
                </div>
                
                <div>
                  <h5 className="mb-3">Write a Review</h5>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert('Review submitted! It will appear after moderation.');
                  }}>
                    <div className="mb-3">
                      <label htmlFor="reviewName" className="form-label">Your Name*</label>
                      <input type="text" className="form-control" id="reviewName" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewEmail" className="form-label">Your Email*</label>
                      <input type="email" className="form-control" id="reviewEmail" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rating*</label>
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i}
                            className="bi bi-star fs-5 me-1"
                            style={{ cursor: 'pointer' }}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewComment" className="form-label">Your Review*</label>
                      <textarea className="form-control" id="reviewComment" rows="4" required></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn" 
                      style={{ backgroundColor: '#08A486', color: 'white' }}
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-4">
          <h3 className="mb-4">Related Products</h3>
          {relatedProducts.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {relatedProducts.map(product => (
                <div key={product.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <Link href={`/product-details/${product.id}`} className="text-decoration-none">
                      <Image 
                        src={product.image} 
                        className="card-img-top" 
                        alt={product.name} 
                        style={{ height: "200px", objectFit: "cover" }}
                        width={50}
                        height={50}
                        />
                    </Link>
                    <div className="card-body">
                      <Link href={`/product-details/${product.id}`} className="text-decoration-none text-dark">
                        <h5 className="card-title">{product.name}</h5>
                      </Link>
                      <div className="d-flex align-items-center mb-2">
                        {product.discountedPrice ? (
                          <>
                            <h6 className="mb-0 me-2">${product.discountedPrice.toFixed(2)}</h6>
                            <span className="text-muted text-decoration-line-through">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <h6 className="mb-0">${product.price.toFixed(2)}</h6>
                        )}
                      </div>
                      <div className="d-flex justify-content-between">
                        <button 
                          className="btn btn-sm" 
                          style={{ backgroundColor: '#08A486', color: 'white' }}
                          onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.discountedPrice || product.price,
                            image: product.image
                          })}
                        >
                          <i className="bi bi-cart-plus"></i> Add to Cart
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-heart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No related products found.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
