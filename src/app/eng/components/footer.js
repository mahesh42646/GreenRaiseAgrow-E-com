export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold" style={{ color: '#08A486' }}>GreenRaise</h5>
            <p className="text-muted">
              Your trusted source for sustainable and eco-friendly products. 
              Making the world greener, one purchase at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-3">
            <h6 className="fw-bold" style={{ color: '#FFA53B' }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/products" className="text-muted text-decoration-none">Products</a></li>
              <li><a href="/categories" className="text-muted text-decoration-none">Categories</a></li>
              <li><a href="/about" className="text-muted text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-muted text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-2 mb-3">
            <h6 className="fw-bold" style={{ color: '#FFA53B' }}>Customer Service</h6>
            <ul className="list-unstyled">
              <li><a href="/help" className="text-muted text-decoration-none">Help Center</a></li>
              <li><a href="/shipping" className="text-muted text-decoration-none">Shipping Info</a></li>
              <li><a href="/returns" className="text-muted text-decoration-none">Returns</a></li>
              <li><a href="/faq" className="text-muted text-decoration-none">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold" style={{ color: '#FFA53B' }}>Contact Us</h6>
            <p className="text-muted mb-1">
              <i className="bi bi-geo-alt"></i> 123 Green Street, Eco City
            </p>
            <p className="text-muted mb-1">
              <i className="bi bi-telephone"></i> +1 (555) 123-4567
            </p>
            <p className="text-muted mb-1">
              <i className="bi bi-envelope"></i> info@greenraise.com
            </p>
            
            {/* Social Media */}
            <div className="mt-3">
              <a href="#" className="text-muted me-3" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-muted me-3" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-muted me-3" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <hr className="my-3" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              © 2024 GreenRaise. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</a>
            <a href="/terms" className="text-muted text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 