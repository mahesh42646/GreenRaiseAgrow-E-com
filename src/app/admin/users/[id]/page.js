'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import adminApi from '../../../../services/adminApi';

export default function UserDetails({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await adminApi.users.getUserById(id);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          status: userData.status
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await adminApi.users.updateUserStatus(id, newStatus);
      setUser({ ...user, status: newStatus });
      setFormData({ ...formData, status: newStatus });
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, this would call an update user API
      // For now, we'll just update the local state
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status
      });
      
      setEditMode(false);
      alert('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminApi.users.deleteUser(id);
        alert('User deleted successfully');
        router.push('/admin/users');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
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

  if (error || !user) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'User not found'}
        <div className="mt-3">
          <Link href="/admin/users" className="btn btn-primary">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">User Details</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link href="/admin/users">Users</Link>
        </li>
        <li className="breadcrumb-item active">User Details</li>
      </ol>
      
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-person-circle me-1"></i>
                User Profile
              </div>
              <div>
                {editMode ? (
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                ) : (
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditMode(true)}>
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                )}
                <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            </div>
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div>
                  <div className="text-center mb-4">
                    <div className="avatar-circle mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h5 className="mb-0">{user.name}</h5>
                    <p className="text-muted">{user.email}</p>
                    <span 
                      className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}
                    >
                      {user.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <strong>User ID:</strong> {user.id}
                  </div>
                  {user.phone && (
                    <div className="mb-3">
                      <strong>Phone:</strong> {user.phone}
                    </div>
                  )}
                  <div className="mb-3">
                    <strong>Joined:</strong> {new Date(user.joined).toLocaleDateString()}
                  </div>
                  <div className="mb-3">
                    <strong>Orders:</strong> {user.orders}
                  </div>
                  <div className="mb-3">
                    <strong>Total Spent:</strong> ${user.spent.toFixed(2)}
                  </div>
                  
                  <div className="mt-4">
                    <h6>Actions</h6>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleStatusChange('active')}
                        disabled={user.status === 'active'}
                      >
                        Activate
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleStatusChange('inactive')}
                        disabled={user.status === 'inactive'}
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-geo-alt me-1"></i>
              Addresses
            </div>
            <div className="card-body">
              {user.addresses && user.addresses.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Address</th>
                        <th>Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.addresses.map((address) => (
                        <tr key={address.id}>
                          <td>{address.type}</td>
                          <td>
                            {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                          </td>
                          <td>
                            {address.isDefault && (
                              <span className="badge bg-success">Default</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No addresses found</p>
              )}
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-cart3 me-1"></i>
              Recent Orders
            </div>
            <div className="card-body">
              {user.recentOrders && user.recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <span 
                              className={`badge ${
                                order.status === 'Delivered' ? 'bg-success' :
                                order.status === 'Processing' ? 'bg-warning' :
                                order.status === 'Shipped' ? 'bg-info' : 'bg-secondary'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>${order.total.toFixed(2)}</td>
                          <td>
                            <Link href={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No recent orders found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 