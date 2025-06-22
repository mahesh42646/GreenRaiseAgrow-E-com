import React from "react";

export default function Product() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Product Details</h1>
          <p className="lead">
            View detailed information about our featured products.
          </p>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="bg-light p-4 rounded" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p className="text-muted">Product Image</p>
              </div>
            </div>
            <div className="col-md-6">
              <h3>Featured Product</h3>
              <p>This eco-friendly product is made from sustainable materials and helps reduce your carbon footprint.</p>
              <div className="d-flex align-items-center mb-3">
                <span className="me-2 fw-bold">Price:</span>
                <span className="text-success">$29.99</span>
              </div>
              <button className="btn me-2" style={{ backgroundColor: '#08A486', color: 'white' }}>
                Add to Cart
              </button>
              <button className="btn btn-outline-secondary">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 