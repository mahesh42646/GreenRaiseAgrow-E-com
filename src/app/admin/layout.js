'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import BootstrapClient from './bootstrap-client';
import './admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AdminLayoutContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, loading, logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !admin && !pathname.endsWith('/admin')) {
      router.push('/admin');
    }
  }, [admin, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not logged in and not on login page, don't render anything (will redirect)
  if (!admin && !pathname.endsWith('/admin')) {
    return null;
  }

  // If on login page and not logged in, just render the children (login form)
  if (!admin && pathname.endsWith('/admin')) {
    return <>{children}</>;
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`d-flex flex-column flex-shrink-0 p-3 text-white bg-dark ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ width: sidebarOpen ? '280px' : '80px', height: '100vh', position: 'fixed', transition: 'width 0.3s ease' }}>
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          {sidebarOpen ? (
            <span className="fs-4">GreenRaise Admin</span>
          ) : (
            <span className="fs-4">GR</span>
          )}
          <button 
            className="btn btn-sm text-white ms-auto" 
            onClick={toggleSidebar}
          >
            <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>
        </div>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link href="/admin/dashboard" className={`nav-link text-white ${pathname.includes('/dashboard') ? 'active' : ''}`}>
              <i className="bi bi-speedometer2 me-2"></i>
              {sidebarOpen && 'Dashboard'}
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className={`nav-link text-white ${pathname.includes('/products') ? 'active' : ''}`}>
              <i className="bi bi-box-seam me-2"></i>
              {sidebarOpen && 'Products'}
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className={`nav-link text-white ${pathname.includes('/orders') ? 'active' : ''}`}>
              <i className="bi bi-cart3 me-2"></i>
              {sidebarOpen && 'Orders'}
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={`nav-link text-white ${pathname.includes('/users') ? 'active' : ''}`}>
              <i className="bi bi-people me-2"></i>
              {sidebarOpen && 'Users'}
            </Link>
          </li>
          <li>
            <Link href="/admin/blogs" className={`nav-link text-white ${pathname.includes('/blogs') ? 'active' : ''}`}>
              <i className="bi bi-file-earmark-text me-2"></i>
              {sidebarOpen && 'Blogs'}
            </Link>
          </li>
          <li>
            <Link href="/admin/tickets" className={`nav-link text-white ${pathname.includes('/tickets') ? 'active' : ''}`}>
              <i className="bi bi-ticket-perforated me-2"></i>
              {sidebarOpen && 'Tickets'}
            </Link>
          </li>
        </ul>
        <hr />
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
            {sidebarOpen && (
              <strong>Admin</strong>
            )}
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1" style={{ marginLeft: sidebarOpen ? '280px' : '80px', transition: 'margin-left 0.3s ease' }}>
        {/* Top navbar */}
        <nav className="navbar navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <button 
              className="navbar-toggler d-md-none" 
              type="button" 
              onClick={toggleSidebar}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="d-flex">
              <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-bell me-2"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem' }}>
                    3
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="dropdownUser2" style={{ minWidth: '300px' }}>
                  <li><h6 className="dropdown-header">Notifications</h6></li>
                  <li><a className="dropdown-item" href="#">New order received</a></li>
                  <li><a className="dropdown-item" href="#">Product out of stock</a></li>
                  <li><a className="dropdown-item" href="#">New user registered</a></li>
                </ul>
              </div>
              <div className="dropdown ms-3">
                <a href="#" className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                  <strong>{admin?.name || 'Admin'}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="dropdownUser3">
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <BootstrapClient />
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminProvider>
  );
} 