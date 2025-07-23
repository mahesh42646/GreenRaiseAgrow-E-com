'use client';

import { useState, useEffect } from "react";
import { productAPI } from "../../../services/api";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import Image from "next/image"; 

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [cartAnimation, setCartAnimation] = useState({ show: false, x: 0, y: 0 });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(product => {
        const price = product.discountedPrice || product.actualPrice;
        switch (priceRange) {
          case "0-500":
            return price <= 500;
          case "500-1000":
            return price > 500 && price <= 1000;
          case "1000-2000":
            return price > 1000 && price <= 2000;
          case "2000+":
            return price > 2000;
          default:
            return true;
        }
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.productName || "").localeCompare(b.productName || "");
        case "price-low":
          return (a.discountedPrice || a.actualPrice || 0) - (b.discountedPrice || b.actualPrice || 0);
        case "price-high":
          return (b.discountedPrice || b.actualPrice || 0) - (a.discountedPrice || a.actualPrice || 0);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy, priceRange]);

  const handleAddToCart = (product, event) => {
    // Get the button position for animation
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    // Find the cart button in the header and calculate its position
    const cartButton = document.querySelector('a[href="/cart"] i.bi-cart3');
    let endX, endY;
    
    if (cartButton) {
      const cartRect = cartButton.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    } else {
      // Fallback to top right corner if cart button not found
      endX = window.innerWidth - 60;
      endY = 80;
    }
    
    setCartAnimation({
      show: true,
      x: startX,
      y: startY,
      endX,
      endY
    });
    
    addToCart({
      id: product.productId,
      name: product.productName,
      price: product.discountedPrice || product.actualPrice,
      image: product.productImage || "https://via.placeholder.com/150"
    });
    
    // Hide animation after completion
    setTimeout(() => {
      setCartAnimation({ show: false, x: 0, y: 0 });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
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

        .cart-animation {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          animation: cartMove 1s ease-in-out forwards;
        }

        @keyframes cartMove {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(${cartAnimation.endX - cartAnimation.x}px, ${cartAnimation.endY - cartAnimation.y}px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(${cartAnimation.endX - cartAnimation.x}px, ${cartAnimation.endY - cartAnimation.y}px) scale(0.8);
            opacity: 0;
          }
        }

        .cart-icon {
          background: #08A486;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(8, 164, 134, 0.3);
        }
      `}</style>
      
      {/* Cart Animation Element */}
      {cartAnimation.show && (
        <div 
          className="cart-animation"
          style={{
            left: cartAnimation.x,
            top: cartAnimation.y
          }}
        >
          <div className="cart-icon">
            <i className="bi bi-cart-plus"></i>
          </div>
        </div>
      )}
      
      <div className="container py-5">
        <div className="row">
          <div className="col-12" style={{minHeight: "80vh"}}>
            <h1 className="mb-1 fw-bold">Shop</h1>
            <p className="lead mb-4">
              Browse our collection of eco-friendly products.
            </p>

            {/* Top Bar with Filters */}
            <div className="mb-4">
              <div className="row g-3 justify-content-between align-items-center">
             

                {/* Sort Dropdown */}
                <div className="col-lg-2 col-6">
                  <select
                    className="form-select border-0 shadow-none bg-light"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <hr className="mt-0" style={{ borderColor: '#e9ecef' }} />
                </div>

                {/* Price Range Filter */}
                <div className="col-lg-2  col-6">
                  <select
                    className="form-select border-0 shadow-none bg-light"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="all">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000-2000">₹1000 - ₹2000</option>
                    <option value="2000+">Above ₹2000</option>
                  </select>
                  <hr className="mt-0" style={{ borderColor: '#e9ecef' }} />
                </div>

                   {/* Search Bar */}
                   <div className="col-12 col-lg-5">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none bg-light"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  </div>
                  <hr className="mt-0" style={{ borderColor: '#e9ecef' }} />
                </div>

                {/* Results Count */}
                <div className="col-lg-1 col-md-6">
                  <div className="text-end">
                    <small className="text-muted">
                      {filteredProducts.length} items
                    </small>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="alert alert-info">
                {searchTerm || priceRange !== "all" 
                  ? "No products match your filters. Try adjusting your search criteria."
                  : "No products found. Check back later for our new arrivals!"
                }
              </div>
            ) : (
              <div className="row rounded-4 p-0">
                {filteredProducts.map((product) => (
                  <div key={product.productId} className="col-6 col-md-6 col-lg-4 col-xl-3 col-sm-6 col-xs-6 mb-4">
                    <div className="h-100 shadow-sm position-relative bg-white py-3 px-3 rounded-4 product-card">
                      <div
                        style={{ position: 'relative', height: '280px', cursor: 'pointer' }}
                        onClick={() => window.location.href = `/product-details/${product.productId}`}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${product.productName || "Product"}`}
                        onKeyPress={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            window.location.href = `/product-details/${product.productId}`;
                          }
                        }}
                      >
                        <Image
                          src={product.productImage || "https://via.placeholder.com/300"}
                          alt={product.productName || "Product"}
                          fill
                          className="card-img-zoom p-1"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div className="py-1">
                        <h5 className="fw-bold" style={{fontSize: '1rem'}}>
                          <Link href={`/product-details/${product.productId}`} className="text-decoration-none text-dark">
                            {product.productName || "Unnamed Product"}
                          </Link>
                        </h5>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {product.discountedPrice ? (
                              <>
                                <span className="fw-bold pe-2" style={{color: '#08A486', fontSize: '1rem'}}>₹{product.discountedPrice.toFixed(1)}</span>
                                <span className="text-muted text-decoration-line-through" style={{fontSize: '0.8rem'}}>₹{product.actualPrice.toFixed(1)}</span>
                              </>
                            ) : (
                              <span className="fw-bold" style={{color: '#08A486', fontSize: '1rem'}}>₹{product.actualPrice ? product.actualPrice.toFixed(2) : "N/A"}</span>
                            )}
                          </div>
                          <div>
                            <i className="bi bi-star-fill text-warning"></i>
                            <span className="ms-1">{product.averageRating || "4.5"}</span>
                          </div>
                        </div>
                        <p className="card-text mb-2 mt-2">{product.shortDescription ? product.shortDescription.substring(0, 30) + "..." : "No description available."}</p>
                        <div className="card-footer bg-white p-0">
                          <div className="d-flex gap-2">
                            {/* <Link href={`/product-details/${product.productId}`} className="btn rounded-3 flex-grow-1" style={{ borderColor: '#08A486', color: '#08A486' }}>
                              View Product
                            </Link> */}
                            <button 
                              className="btn rounded-3 flex-grow-1" 
                              style={{ backgroundColor: '#08A486', color: 'white', minWidth: '45px' }}
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={!product.productId || !product.productName}
                              title="Add to Cart"
                            >Add to Cart
                              <i className="bi bi-cart-plus ms-3"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 