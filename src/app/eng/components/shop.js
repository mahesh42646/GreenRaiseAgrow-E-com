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
        console.error("Error fetching products:", err);
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
      image: product.productImage && product.productImage.length > 0 
        ? product.productImage[0] 
        : "https://via.placeholder.com/150"
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
        <div className="col-12">
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
                        src={product.productImage && product.productImage.length > 0 
                          ? product.productImage[0] 
                          : "https://via.placeholder.com/300"}
                        className="card-img-top" 
                        alt={product.productName} 
                        style={{ height: "200px", objectFit: "cover" }}
                        width={50}
                        height={50}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        <Link href={`/product-details/${product.productId}`} className="text-decoration-none text-dark">
                          {product.productName}
                        </Link>
                      </h5>
                      <p className="card-text small text-muted mb-2">{product.shortDescription.substring(0, 60)}...</p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          {product.discountedPrice ? (
                            <>
                              <span className="fw-bold">${product.discountedPrice.toFixed(2)}</span>
                              <span className="text-muted text-decoration-line-through">${product.actualPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="fw-bold">${product.actualPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <button 
                          className="btn btn-sm w-100" 
                          style={{ backgroundColor: '#08A486', color: 'white' }}
                          onClick={() => handleAddToCart(product)}
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