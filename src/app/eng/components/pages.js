import React from "react";

export default function Pages() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Pages</h1>
          <p className="lead">
            Explore additional pages and resources.
          </p>
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">About Us</h5>
                  <p className="card-text">Learn more about our mission, vision, and commitment to sustainability.</p>
                  <a href="#" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
                    View Page
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Contact Us</h5>
                  <p className="card-text">Get in touch with our team for inquiries, feedback, or support.</p>
                  <a href="#" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
                    View Page
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">FAQ</h5>
                  <p className="card-text">Find answers to frequently asked questions about our products and services.</p>
                  <a href="#" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
                    View Page
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Sustainability</h5>
                  <p className="card-text">Discover our initiatives and commitment to environmental sustainability.</p>
                  <a href="#" className="btn" style={{ backgroundColor: '#08A486', color: 'white' }}>
                    View Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 