"use client";
import { useState, useEffect } from 'react';

export default function AdminDeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/delivery-partners');
      const data = await res.json();
      setPartners(data);
    } catch (err) {
      setError('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/ecom/delivery-partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ name: '', email: '', phone: '', password: '' });
      setShowAdd(false);
      fetchPartners();
    } catch (err) {
      alert('Failed to add partner');
    }
  };

  const handleShowOrders = async (partner) => {
    setSelectedPartner(partner);
    try {
      const res = await fetch(`/api/ecom/delivery-partners/${partner._id}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrders([]);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Delivery Partners</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Manage Delivery Partners</li>
      </ol>
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-truck me-1"></i>
            Partner List
          </div>
          <button className="btn btn-success btn-sm" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Close' : 'Add Partner'}
          </button>
        </div>
        <div className="card-body">
          {showAdd && (
            <form className="mb-4" onSubmit={handleAdd}>
              <div className="row g-2 align-items-end">
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="col-md-3">
                  <input type="email" className="form-control" placeholder="Email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <input type="text" className="form-control" placeholder="Phone" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <input type="password" className="form-control" placeholder="Password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100" type="submit">Add</button>
                </div>
              </div>
            </form>
          )}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map(partner => (
                    <tr key={partner._id}>
                      <td>{partner.name}</td>
                      <td>{partner.email}</td>
                      <td>{partner.phone}</td>
                      <td><span className={`badge ${partner.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{partner.status}</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShowOrders(partner)}>
                          <i className="bi bi-list"></i> Orders
                        </button>
                        {/* Add edit/remove actions here if needed */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Orders Modal */}
      {selectedPartner && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="card border-0">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Orders for <span className="text-primary">{selectedPartner.name}</span></h5>
                    <div className="small text-muted">{selectedPartner.email} | {selectedPartner.phone}</div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => { setSelectedPartner(null); setOrders([]); }}></button>
                </div>
                <div className="card-body">
                  {orders.length === 0 ? (
                    <div className="alert alert-info">No assigned orders.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Delivery Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order._id}>
                              <td>{order._id}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>{order.status}</td>
                              <td>{order.deliveryStatus}</td>
                              <td>₹{order.total?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white border-0 text-end">
                  <button className="btn btn-outline-secondary" onClick={() => { setSelectedPartner(null); setOrders([]); }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 