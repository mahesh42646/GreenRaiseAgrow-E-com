'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import adminApi from '../../../services/adminApi';

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
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.orders.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
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
              {statuses.map(status => (
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
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    Order ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('customer')} style={{ cursor: 'pointer' }}>
                    Customer {sortBy === 'customer' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('total')} style={{ cursor: 'pointer' }}>
                    Total {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <div className="fw-bold">{order.customer.name}</div>
                        <small className="text-muted">{order.customer.email}</small>
                      </td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <div className="dropdown">
                          <button 
                            className={`btn btn-sm dropdown-toggle ${
                              order.status === 'Delivered' ? 'btn-success' : 
                              order.status === 'Processing' ? 'btn-warning' : 
                              order.status === 'Shipped' ? 'btn-info' : 'btn-secondary'
                            }`}
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                          >
                            {order.status}
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(order.id, 'Processing')}
                                disabled={order.status === 'Processing'}
                              >
                                Processing
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(order.id, 'Shipped')}
                                disabled={order.status === 'Shipped'}
                              >
                                Shipped
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(order.id, 'Delivered')}
                                disabled={order.status === 'Delivered'}
                              >
                                Delivered
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                disabled={order.status === 'Cancelled'}
                              >
                                Cancelled
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link href={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(order.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
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
    </div>
  );
}
