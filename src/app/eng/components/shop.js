'use client';

import { useState, useEffect } from "react";
import { productAPI } from "../../../services/api";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import Image from "next/image"; 
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

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

  const handleAddToCart = (product) => {
    addToCart({
      id: product.productId,
      name: product.productName,
      price: product.discountedPrice || product.actualPrice,
      image: product.productImage || "https://via.placeholder.com/150"
    });
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
    <div className="container py-5">
      <div className="row">
        <div className="col-12 " style={{minHeight: "80vh"}}>
          <h1 className="mb-4">Shop</h1>
          <p className="lead">
            Browse our collection of eco-friendly products.
          </p>
          
          {products.length === 0 ? (
            <div className="alert alert-info">
              No products found. Check back later for our new arrivals!
            </div>
          ) : (
            <div className="row mt-4">
              {products.map((product) => (
                <div key={product.productId} className="col-md-3 mb-4">
                  <div className="card h-100">
                    <Link href={`/product-details/${product.productId}`}>
                      <Image 
                        src={product.productImage || "https://via.placeholder.com/300"}
                        className="card-img-top" 
                        alt={product.productName || "Product"} 
                        style={{ height: "200px", objectFit: "cover" }}
                        width={300}
                        height={200}
                        unoptimized={true}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        <Link href={`/product-details/${product.productId}`} className="text-decoration-none text-dark">
                          {product.productName || "Unnamed Product"}
                        </Link>
                      </h5>
                      <p className="card-text small text-muted mb-2">{product.shortDescription ? product.shortDescription.substring(0, 60) + "..." : "No description available."}</p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          {product.discountedPrice ? (
                            <>
                              <span className="fw-bold">₹{product.discountedPrice.toFixed(2)}</span>
                              <span className="text-muted text-decoration-line-through">₹{product.actualPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="fw-bold">₹{product.actualPrice ? product.actualPrice.toFixed(2) : "N/A"}</span>
                          )}
                        </div>
                        <button 
                          className="btn btn-sm w-100" 
                          style={{ backgroundColor: '#08A486', color: 'white' }}
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.productId || !product.productName}
                        >
                          <i className="bi bi-cart-plus me-1"></i> Add to Cart
                        </button>
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
  );
} 