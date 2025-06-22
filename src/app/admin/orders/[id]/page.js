'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import adminApi from '../../../../services/adminApi';

export default function OrderDetails({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await adminApi.orders.getOrderById(id);
        setOrder(orderData);
        setNewStatus(orderData.status);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    if (newStatus === order.status) {
      return;
    }
    
    try {
      await adminApi.orders.updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
      alert('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await adminApi.orders.deleteOrder(id);
        alert('Order deleted successfully');
        router.push('/admin/orders');
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Failed to delete order');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Order not found'}
        <div className="mt-3">
          <Link href="/admin/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Order Details</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link href="/admin/orders">Orders</Link>
        </li>
        <li className="breadcrumb-item active">Order Details</li>
      </ol>
      
      <div className="row">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-cart3 me-1"></i>
                Order #{order.id}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                  <i className="bi bi-trash me-1"></i> Delete Order
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Order Information</h5>
                  <p className="mb-1">
                    <strong>Date:</strong> {new Date(order.date).toLocaleString()}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>
                    <span 
                      className={`badge ms-2 ${
                        order.status === 'Delivered' ? 'bg-success' :
                        order.status === 'Processing' ? 'bg-warning' :
                        order.status === 'Shipped' ? 'bg-info' : 'bg-secondary'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="mb-1">
                    <strong>Payment Method:</strong> {order.payment}
                  </p>
                  <p className="mb-1">
                    <strong>Shipping Method:</strong> {order.shipping}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5>Customer Information</h5>
                  <p className="mb-1">
                    <strong>Name:</strong> {order.customer.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {order.customer.email}
                  </p>
                  {order.customer.phone && (
                    <p className="mb-1">
                      <strong>Phone:</strong> {order.customer.phone}
                    </p>
                  )}
                  <p className="mb-1">
                    <Link href={`/admin/users/${order.customer.id}`} className="btn btn-sm btn-outline-primary mt-2">
                      View Customer Profile
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Shipping Address</h5>
                  <address>
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </address>
                </div>
                <div className="col-md-6">
                  <h5>Billing Address</h5>
                  <address>
                    {order.billingAddress.street}<br />
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                    {order.billingAddress.country}
                  </address>
                </div>
              </div>
              
              <h5>Order Items</h5>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="ms-2">
                              <div className="fw-bold">{item.name}</div>
                              <small className="text-muted">SKU: {item.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td className="text-end">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                      <td className="text-end">${order.total.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Shipping:</strong></td>
                      <td className="text-end">$0.00</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td className="text-end"><strong>${order.total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {order.notes && (
                <div className="mt-4">
                  <h5>Order Notes</h5>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-xl-4">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-gear me-1"></i>
              Order Actions
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="orderStatus" className="form-label">Update Order Status</label>
                <select
                  className="form-select mb-3"
                  id="orderStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button 
                  className="btn btn-primary w-100" 
                  onClick={handleStatusChange}
                  disabled={newStatus === order.status}
                >
                  Update Status
                </button>
              </div>
              
              <hr />
              
              <div className="mb-3">
                <h6>Quick Actions</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-printer me-1"></i> Print Invoice
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-envelope me-1"></i> Email Customer
                  </button>
                </div>
              </div>
              
              <hr />
              
              <div className="mb-3">
                <h6>Order Timeline</h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0">
                    <div className="d-flex justify-content-between">
                      <span>Order Placed</span>
                      <small className="text-muted">{new Date(order.date).toLocaleDateString()}</small>
                    </div>
                  </li>
                  {order.status !== 'Cancelled' && (
                    <>
                      <li className="list-group-item px-0">
                        <div className="d-flex justify-content-between">
                          <span>Processing</span>
                          <small className="text-muted">
                            {order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 
                              new Date(new Date(order.date).getTime() + 86400000).toLocaleDateString() : '-'}
                          </small>
                        </div>
                      </li>
                      <li className="list-group-item px-0">
                        <div className="d-flex justify-content-between">
                          <span>Shipped</span>
                          <small className="text-muted">
                            {order.status === 'Shipped' || order.status === 'Delivered' ? 
                              new Date(new Date(order.date).getTime() + 172800000).toLocaleDateString() : '-'}
                          </small>
                        </div>
                      </li>
                      <li className="list-group-item px-0">
                        <div className="d-flex justify-content-between">
                          <span>Delivered</span>
                          <small className="text-muted">
                            {order.status === 'Delivered' ? 
                              new Date(new Date(order.date).getTime() + 432000000).toLocaleDateString() : '-'}
                          </small>
                        </div>
                      </li>
                    </>
                  )}
                  {order.status === 'Cancelled' && (
                    <li className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <span>Cancelled</span>
                        <small className="text-muted">
                          {new Date(new Date(order.date).getTime() + 86400000).toLocaleDateString()}
                        </small>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 