'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push(path);
  };

  const handleSocialClick = (platform) => {
    const socialLinks = {
      facebook: 'https://www.facebook.com/GreenRaiseUrbanGardening/',
      twitter: 'https://x.com/GreenRaiseUrban',
      instagram: 'https://www.instagram.com/GreenRaiseUrbanGardening/',
    };

    if (socialLinks[platform]) {
      window.open(socialLinks[platform], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-dark text-white mt-5" 
    style={{
      backgroundImage: 'url(./1041.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
    >
      <div  className='py-5'
      style={{
       backgroundColor: 'rgba(0, 0, 0, 0.57)',
      }}>
      <div className="container "
      >
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-3">
          <Link href="/" className="navbar-brand fw-bolder fs-3 text-decoration-none">
                                <Image src="/Logo-h.png" alt="GreenRaise" width={100} height={100} style={{ width: 'auto', height: '64px' }} />
                                </Link>
            <p className="text-white">
              Your trusted source for sustainable and eco-friendly products. 
              Making the world greener, one purchase at a time.
            </p>
            <div className="mt-3 d-flex align-items-center">
              <span className="me-2">Share:</span>
              <a href="https://www.facebook.com/GreenRaiseUrbanGardening/" target="_blank" rel="noopener noreferrer" className="d-inline-block me-2" style={{ border: '1px solid #fff', borderRadius: '50%', width: 32, height: 32, textAlign: 'center', lineHeight: '32px', color: '#fff', fontSize: '1.2rem' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/GreenRaiseUrbanGardening/" target="_blank" rel="noopener noreferrer" className="d-inline-block me-2" style={{ border: '1px solid #fff', borderRadius: '50%', width: 32, height: 32, textAlign: 'center', lineHeight: '32px', color: '#fff', fontSize: '1.2rem' }}>
                <i className="bi bi-instagram"></i>
              </a>
              {/* <a href="https://x.com/GreenRaiseUrban" target="_blank" rel="noopener noreferrer" className="d-inline-block" style={{ border: '1px solid #fff', borderRadius: '50%', width: 32, height: 32, textAlign: 'center', lineHeight: '32px', color: '#fff', fontSize: '1.2rem' }}>
                <i className="bi bi-twitter-x"></i>
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-3">
            <h6 className="fw-bold" style={{ color: '#FFA53B' }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li onClick={() => handleNavigate('/')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Home</li>
              <li onClick={() => handleNavigate('/shop')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Shop</li>
              <li onClick={() => handleNavigate('/blog')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Blog</li>
              <li onClick={() => handleNavigate('/cart')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Cart</li>
              <li onClick={() => handleNavigate('/about')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>About</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-2 mb-3">
            <h6 className="fw-bold" style={{ color: '#FFA53B' }}>Customer Service</h6>
            <ul className="list-unstyled">
              <li onClick={() => handleNavigate('/terms-and-conditions')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Terms & Condition</li>
              <li onClick={() => handleNavigate('/shipping-and-delivery')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Shipping Info</li>
              <li onClick={() => handleNavigate('/cancellation-and-refund')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Refund Policy</li>
              <li onClick={() => handleNavigate('/privacy-policy')} className="text-white text-decoration-none" style={{ cursor: 'pointer' }}>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold" style={{ color: '#FFA53B', fontSize: '1rem' }}>Contact Us</h6>
            <div className="mb-2 d-flex align-items-start">
              <i className="bi bi-geo-alt-fill me-2" style={{ color: '#FFA53B', fontSize: '1.5rem' }}></i>
              <div>
                <div>Chandrakant Jadhav (Partner)</div>
                <div className="fw-bold">Green Rise Agro Industries</div>
                <div>Survey No. 13, Office No. 6, Shivanand Complex, Satavwadi</div>
                <div>Hadapsar, Pune - 411028, Maharashtra, India</div>
                <div>
                  <a
                    href="https://maps.google.com/?q=Survey No. 13, Office No. 6, Shivanand Complex, Satavwadi, Hadapsar, Pune - 411028, Maharashtra, India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-bold text-white text-decoration-none"
                    style={{ display: 'inline-flex', alignItems: 'center', marginTop: 4 }}
                  >
                    Get Directions <span className="ms-1" style={{ fontSize: '1.2em' }}>➔</span>
                  </a>
                </div>
              </div>
            </div>
           
            <div className="mb-2 d-flex align-items-center">
              <i className="bi bi-telephone-fill me-2" style={{ color: '#FFA53B', fontSize: '1.3rem' }}></i>
              <span className="fw-bold">8048988846</span>
            </div>
           
          </div>
        </div>

        {/* Bottom Footer */}
        <hr className="my-3" />
        <div className="d-flex justify-content-center align-items-center">
          <div className="">
            <p className="text-white mb-0">
              © 2024 GreenRaise. All rights reserved.
            </p>
          </div>
         
        </div>
      </div>
      </div>
      
    </footer>
  );
}
