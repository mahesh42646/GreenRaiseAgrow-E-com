'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import adminApi from '../../../services/adminApi';

const STATUS_OPTIONS = ['placed', 'pending', 'out for delivery', 'cancelled', 'complete'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await adminApi.orders.getAllOrders();
        setOrders(data || []); // Ensure we have an array even if the API returns null/undefined
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle search and filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customerEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'total':
        aValue = a.total;
        bValue = b.total;
        break;
      case 'customer':
        aValue = a.customer.name;
        bValue = b.customer.name;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.orders.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await adminApi.orders.deleteOrder(orderId);
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Failed to delete order');
      }
    }
  };

  // Get unique statuses for filter
  const statuses = ['All', ...new Set(orders.map(order => order.status))];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Orders</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Orders Management</li>
      </ol>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-cart3 me-1"></i>
            Order List
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 'auto' }}
            >
              {['All', ...STATUS_OPTIONS].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.customerName || '-'}</td>
                      <td>{order.customerEmail || '-'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.total?.toFixed(2)}</td>
                      <td>
                        <select
                          className={`form-select form-select-sm w-auto ${order.status === 'complete' ? 'bg-success text-white' : order.status === 'cancelled' ? 'bg-danger text-white' : order.status === 'out for delivery' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewOrder(order)}>
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="card border-0">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Order <span className="text-muted">#{selectedOrder._id}</span></h5>
                    <div className="small text-muted">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={`badge px-3 py-2 fs-6 ${selectedOrder.status === 'complete' ? 'bg-success' : selectedOrder.status === 'cancelled' ? 'bg-danger' : selectedOrder.status === 'out for delivery' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>{selectedOrder.status?.toUpperCase() || selectedOrder.paymentStatus?.toUpperCase() || 'PROCESSING'}</span>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <h6 className="fw-bold mb-2">Shipping Address</h6>
                      <div className="small">
                        {selectedOrder.shippingAddress},<br />
                        {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode},<br />
                        {selectedOrder.country}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-2">Payment</h6>
                      <span className={`badge bg-light text-dark border px-3 py-2 fs-6 me-2`}>{selectedOrder.paymentDetails?.method ? selectedOrder.paymentDetails.method : (selectedOrder.paymentDetails?.upi ? 'UPI' : (selectedOrder.paymentDetails?.card ? 'Card' : 'Online'))}</span>
                      <div className="small text-muted mt-2">{selectedOrder.customerName}<br />{selectedOrder.customerEmail}</div>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-3">Products</h6>
                  <div className="table-responsive mb-4">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price?.toFixed(2)}</td>
                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="mb-2 mb-md-0">
                    <span className="me-3"><strong>Subtotal:</strong> ₹{selectedOrder.subtotal?.toFixed(2)}</span>
                    <span className="me-3"><strong>Shipping:</strong> ₹{selectedOrder.shippingCost?.toFixed(2)}</span>
                    <span><strong>Total:</strong> <span className="fs-5">₹{selectedOrder.total?.toFixed(2)}</span></span>
                  </div>
                  <div>
                    <button className="btn btn-outline-secondary" onClick={handleCloseOrderModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
