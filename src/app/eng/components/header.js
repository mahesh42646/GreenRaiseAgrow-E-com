'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Header() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const pathname = usePathname();
    const { getCartTotals } = useCart();
    const { user } = useAuth();
    
    // Get cart item count
    const { itemCount } = getCartTotals();
    
    // Get the active tab from the pathname
    const getActiveTab = () => {
        const path = pathname.split('/')[1];
        if (path === '') return '/';
        return `/${path}`;
    };
    
    const activeTab = getActiveTab();

    const handleOffcanvasToggle = () => setIsOffcanvasOpen(!isOffcanvasOpen);

    const navLinks = [
        { name: 'Home', href: '/', dropdown: true },
        { name: 'Shop', href: '/shop', dropdown: true },
        { name: 'Blog', href: '/blog', dropdown: true },
        { name: 'Cart', href: '/cart', dropdown: true },
        // { name: 'Pages', href: '/pages', dropdown: true, badge: 'New' },
    ];

    return (
        <header className="shadow-sm mb-2 bg-white">
            {/* --- Desktop Header --- */}
            <div className="d-none d-lg-block">
                {/* Top Bar */}
                <div className="border-bottom  py-3">
                    <div className="container">
                        <div className="row align-items-center">
                            {/* Logo */}
                            <div className="col-auto">
                                <Link href="/" className="navbar-brand fw-bolder fs-3 text-decoration-none">
                                    <span style={{ color: '#08A486' }}>Green</span>Raise.
                                </Link>
                            </div>

                            {/* Location */}
                            <div className="col-auto ">
                                <div className="d-flex align-items-center border rounded-2 px-2 py-2">
                                    <i className="bi bi-geo-alt me-2 text-muted "></i>
                                    <div className="dropdown">
                                        <a className="dropdown-toggle text-dark text-decoration-none" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Your Location
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">New York</a></li>
                                            <li><a className="dropdown-item" href="#">Los Angeles</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Search */}
                            <div className="col">
                                <div className="input-group ">
                                    <input type="text" className="form-control py-2" placeholder="I'm searching for..." />
                                    <button className="btn" type="button" style={{ backgroundColor: '#FFA53B', color: 'white' }}>
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Icons */}
                            <div className="col-auto">
                                <div className="d-flex align-items-center">
                                    <Link href="/contact" className="text-dark me-3 "><i className="bi bi-telephone fs-4"></i></Link>
                                    {/* <Link href="/wishlist" className="text-dark me-3 "><i className="bi bi-heart fs-5"></i></Link> */}
                                    <Link href="/cart" className="text-dark me-3  position-relative">
                                        <i className="bi bi-cart3 fs-4"></i>
                                        {itemCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6em', padding: '0.2em 0.5em' }}>
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link href="/account" className="text-dark">
                                        <i className="bi bi-person fs-4"></i>
                                        {user && (
                                            <span className="ms-2 d-none d-xl-inline">
                                                {user.name.split(' ')[0]}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Nav Bar */}
                <div className="py-2">
                    <div className="container">
                        <div className="d-flex align-items-center">
                            <button className="btn d-flex align-items-center fw-semibold py-2 me-lg-3" style={{ backgroundColor: '#08A486', color: 'white' }}>
                                <i className="bi bi-list-ul me-2"></i> All Categories
                            </button>
                            <ul className="navbar-nav flex-row px-lg-5">
                                {navLinks.map(link => (
                                    <li key={link.name} className="nav-item me-lg-4 position-relative">
                                        <Link href={link.href} className="nav-link fw-bold" style={{ 
                                            color: activeTab === link.href ? '#08A486' : 'inherit',
                                            fontWeight: activeTab === link.href ? 'bold' : 'bold' 
                                        }}>
                                            {link.name}
                                        </Link>
                                        {link.badge && (
                                            <span className="badge bg-danger position-absolute" style={{ fontSize: '0.6em', padding: '0.3em 0.5em', top: '0.2rem', right: '-0.8rem' }}>
                                                {link.badge}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="ms-auto">
                                <button className="btn btn-outline-success border-2 fw-bold d-flex py-2 align-items-center" style={{ borderColor: '#08A486', color: '#08A486', borderWidth: '1px' }}>
                                    <i className="bi bi-lightning-charge-fill me-2"></i> Deal Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Mobile Header --- */}
            <div className="d-lg-none border-bottom">
                <div className="container d-flex justify-content-between align-items-center py-2">
                    <button className="btn" type="button" onClick={handleOffcanvasToggle}>
                        <i className="bi bi-list fs-3"></i>
                    </button>
                    <Link href="/" className="navbar-brand fw-bolder fs-3 text-decoration-none">
                        <span style={{ color: '#08A486' }}>Green</span>Raise.
                    </Link>
                    <div className="d-flex align-items-center">
                        <Link href="/cart" className="text-dark me-3 position-relative">
                            <i className="bi bi-cart3 fs-4"></i>
                            {itemCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6em', padding: '0.2em 0.5em' }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/account" className="text-dark">
                            <i className="bi bi-person fs-4"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- Mobile Offcanvas Menu --- */}
            <div className={`offcanvas offcanvas-start ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1" style={{ visibility: isOffcanvasOpen ? 'visible' : 'hidden' }}>
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title">Menu</h5>
                    <button type="button" className="btn-close" onClick={handleOffcanvasToggle}></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav">
                        {navLinks.map(link => (
                             <li key={link.name} className="nav-item mb-2">
                                <Link href={link.href} className="text-decoration-none fs-5" onClick={handleOffcanvasToggle}>
                                    <div className="d-flex align-items-center">
                                        <span style={{ 
                                            color: activeTab === link.href ? '#08A486' : 'inherit', 
                                            fontWeight: activeTab === link.href ? 'bold' : 'normal' 
                                        }}>
                                            {link.name}
                                        </span>
                                        {link.badge && (
                                            <span className="badge bg-danger ms-2" style={{ fontSize: '0.6em', padding: '0.4em 0.6em' }}>
                                                {link.badge}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                        <li className="nav-item mb-2">
                            <Link href="/contact" className="text-decoration-none fs-5" onClick={handleOffcanvasToggle}>
                                Contact
                            </Link>
                        </li>
                        {user ? (
                            <li className="nav-item mt-4">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-person-circle me-2"></i>
                                    <span>Hello, {user.name.split(' ')[0]}</span>
                                </div>
                            </li>
                        ) : (
                            <li className="nav-item mt-4">
                                <Link href="/account" className="btn w-100" style={{ backgroundColor: '#08A486', color: 'white' }} onClick={handleOffcanvasToggle}>
                                    Login / Register
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            {isOffcanvasOpen && <div className="offcanvas-backdrop fade show" onClick={handleOffcanvasToggle}></div>}
        </header>
    );
}
