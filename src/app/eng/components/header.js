'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        { name: 'Home', href: '/', dropdown: true, icon: 'bi-house-door' },
        { name: 'Shop', href: '/shop', dropdown: true, icon: 'bi-bag' },
        { name: 'Blog', href: '/blog', dropdown: true, icon: 'bi-journal-text',  },
        { name: 'Contact', href: '/contact', dropdown: true, icon: 'bi-telephone' },
        { name: 'Cart', href: '/cart', dropdown: true, icon: 'bi-cart3', badge: itemCount > 0 ? itemCount : null },
    ];

    return (
        <header className="shadow-sm mb-0 bg-white">
            {/* --- Desktop Header --- */}
            <div className="d-none d-lg-block">


                {/* Bottom Nav Bar */}
                <div className="py-2">
                    <div className="container">
                        <div className="d-flex align-items-center">
                        <div className="col-auto">
                                <Link href="/" className="navbar-brand fw-bolder fs-3 text-decoration-none">
                                <Image src="/Logo-h.png" alt="GreenRaise" width={100} height={100} style={{ width: 'auto', height: '64px' }} />
                                </Link>
                            </div>

                            <ul className="navbar-nav flex-row px-lg-5">
                                {navLinks.map(link => (
                                    <li key={link.name} className="nav-item me-lg-4 position-relative">
                                        <Link href={link.href} className="nav-link fw-bold d-flex align-items-center" style={{
                                            color: activeTab === link.href ? '#08A486' : 'inherit',
                                            fontWeight: activeTab === link.href ? 'bold' : 'bold'
                                        }}>
                                            {link.icon && <i className={`bi ${link.icon} me-2`}></i>}
                                            {link.name}
                                            {link.badge && (
                                                <span className="badge bg-danger ms-2 position-absolute top-0 start-100 translate-middle rounded-pill" style={{ fontSize: '0.6em', padding: '0.3em 0.5em', right: '-0.8rem', height: '16px', width: '16px' }}>
                                                    {link.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="ms-auto  d-flex align-items-center">

                                {/* Icons */}
                                <div className=" px-3 my-auto pt-1">
                                    <div className="d-flex align-items-center">
                                      
                                        <Link href="/account" className="text-dark d-flex align-items-center border border-dark rounded-pill p-2 shadow-sm" style={{ height: '44px', width: '44px'}}>
                                            <i className="bi bi-person fs-4"></i>
                                            {user && (
                                                <span className="ms-2 d-none d-xl-inline border border-dark rounded-pill px-2 py-1">
                                                    {user.name.split(' ')[0]}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                                <button className="btn d-flex align-items-center fw-semibold py-2 me-lg-3" style={{ backgroundColor: '#08A486', color: 'white' }}>
                                    <i className="bi bi-list-ul me-2"></i> All Categories
                                </button>
                                <button className="btn btn-outline-success border-2 fw-bold d-flex py-2 align-items-center" style={{ borderColor: '#08A486', color: '#08A486', borderWidth: '1px' }}>
                                    <i className="bi bi-lightning-charge-fill me-2"></i> Deal Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Mobile Header --- */}
            <div className="d-lg-none border-bottom sticky-top bg-white" style={{ zIndex: 1040 }}>
                <div className="container-fluid px-2 d-flex justify-content-between align-items-center py-2">
                    <button className="btn p-0 me-2" type="button" aria-label="Open menu" onClick={handleOffcanvasToggle}>
                        <i className="bi bi-list fs-2"></i>
                    </button>
                    <Link href="/" className="navbar-brand fw-bolder fs-3 text-decoration-none mx-auto">
                        <Image src="/Logo-h.png" alt="GreenRaise" width={60} height={60} style={{ height: '48px', width: 'auto' }} />
                    </Link>
                    <div className="d-flex align-items-center ms-auto">
                        <Link href="/cart" className="text-dark position-relative me-3" aria-label="Cart">
                            <i className="bi bi-cart3 fs-3"></i>
                            {itemCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7em', padding: '0.2em 0.5em' }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/account" className="text-dark" aria-label="Account">
                            <i className="bi bi-person fs-3"></i>
                        </Link>
                    </div>
                </div>
                <div className="container-fluid px-2 pb-2 d-flex gap-2">
                    <button className="btn flex-fill d-flex align-items-center fw-semibold py-2" style={{ backgroundColor: '#08A486', color: 'white' }}>
                        <i className="bi bi-list-ul me-2"></i> All Categories
                    </button>
                    <button className="btn btn-outline-success border-2 fw-bold d-flex flex-fill py-2 align-items-center" style={{ borderColor: '#08A486', color: '#08A486', borderWidth: '1px' }}>
                        <i className="bi bi-lightning-charge-fill me-2"></i> Deal Today
                    </button>
                </div>
            </div>

            {/* --- Mobile Offcanvas Menu --- */}
            <div className={`offcanvas offcanvas-start ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1" style={{ visibility: isOffcanvasOpen ? 'visible' : 'hidden', zIndex: 2000 }}>
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title">Menu</h5>
                    <button type="button" className="btn-close" aria-label="Close menu" onClick={handleOffcanvasToggle}></button>
                </div>
                <div className="offcanvas-body px-3">
                    <ul className="navbar-nav">
                        {navLinks.map(link => (
                            <li key={link.name} className="nav-item mb-2 position-relative">
                                <Link href={link.href} className="text-decoration-none fs-5 d-flex align-items-center py-2 px-2 rounded" style={{ background: activeTab === link.href ? '#e8f5e8' : 'transparent', color: activeTab === link.href ? '#08A486' : 'inherit', fontWeight: activeTab === link.href ? 'bold' : 'normal' }} onClick={handleOffcanvasToggle}>
                                    {link.icon && <i className={`bi ${link.icon} me-2`}></i>}
                                    {link.name}
                                    {link.badge && (
                                        <span className="badge bg-danger ms-2 position-absolute top-0 start-100 translate-middle rounded-pill" style={{ fontSize: '0.7em', padding: '0.3em 0.6em', right: '-0.8rem' }}>
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
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
            {isOffcanvasOpen && <div className="offcanvas-backdrop fade show" style={{ zIndex: 1999 }} onClick={handleOffcanvasToggle}></div>}
        </header>
    );
}
