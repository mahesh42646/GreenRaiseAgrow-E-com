"use client";
import { useState, useEffect } from 'react';

export default function AdminShiprocketDashboard() {
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchShipments();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/orders');
      const data = await res.json();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchShipments = async () => {
    const res = await fetch('/api/ecom/shiprocket/shipments');
    const data = await res.json();
    // Map by orderId for quick lookup
    const map = {};
    data.forEach(s => { map[s.orderId] = s; });
    setShipments(map);
  };

  const handleCreateShipment = async (orderId) => {
    setCreating(orderId);
    await fetch('/api/ecom/shiprocket/create-shipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    await fetchShipments();
    setCreating(null);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Shiprocket Dashboard</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Manage Shiprocket Shipments</li>
      </ol>
      <div className="card mb-4">
        <div className="card-header">
          <i className="bi bi-truck me-1"></i>
          Orders & Shipments
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Shiprocket Status</th>
                    <th>AWB</th>
                    <th>Tracking</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const shipment = shipments[order._id];
                    return (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.customerName || '-'}<br /><small>{order.customerEmail}</small></td>
                        <td>₹{order.total?.toFixed(2)}</td>
                        <td>{shipment ? shipment.status : <span className="text-muted">Not shipped</span>}</td>
                        <td>{shipment ? shipment.awb : '-'}</td>
                        <td>{shipment ? <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer">Track</a> : '-'}</td>
                        <td>
                          {!shipment && (
                            <button className="btn btn-sm btn-primary" disabled={creating === order._id} onClick={() => handleCreateShipment(order._id)}>
                              {creating === order._id ? 'Creating...' : 'Create Shipment'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 