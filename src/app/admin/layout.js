'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import BootstrapClient from './bootstrap-client';
import './admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from 'next/image';

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
          <li>
            <Link href="/admin/coupan" className={`nav-link text-white ${pathname.includes('/coupan') ? 'active' : ''}`}>
              <i className="bi bi-cash-coin me-2"></i>
              {sidebarOpen && 'Coupan'}
            </Link>
          </li>
          <li>
            <Link href="/admin/delivery-partners" className={`nav-link text-white ${pathname.includes('/delivery-partners') ? 'active' : ''}`}>
              <i className="bi bi-truck me-2"></i>
              {sidebarOpen && 'Delivery Partners'}
            </Link>
          </li>
          <li>
            <Link href="/admin/shiprocket" className={`nav-link text-white ${pathname.includes('/shiprocket') ? 'active' : ''}`}>
              <i className="bi bi-truck me-2"></i>
              {sidebarOpen && 'Shiprocket'}
            </Link>
          </li>

        </ul>
        <hr />
        <div className="dropdown">
          <button className="btn btn-outline-light border-0 btn-sm " onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1" style={{ marginLeft: sidebarOpen ? '280px' : '80px', transition: 'margin-left 0.3s ease' }}>
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