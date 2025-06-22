'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import adminApi from '../../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminApi.dashboard.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <h1 className="mt-4">Dashboard</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Dashboard</li>
      </ol>
      
      {/* Stats Cards */}
      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">{stats.counts.products}</h2>
                  <div>Products</div>
                </div>
                <div>
                  <i className="bi bi-box-seam fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link href="/admin/products" className="small text-white stretched-link">View Details</Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">{stats.counts.orders}</h2>
                  <div>Orders</div>
                </div>
                <div>
                  <i className="bi bi-cart3 fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link href="/admin/orders" className="small text-white stretched-link">View Details</Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">{stats.counts.users}</h2>
                  <div>Users</div>
                </div>
                <div>
                  <i className="bi bi-people fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link href="/admin/users" className="small text-white stretched-link">View Details</Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-danger text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">${stats.revenue.total.toFixed(2)}</h2>
                  <div>Revenue</div>
                </div>
                <div>
                  <i className="bi bi-currency-dollar fs-1"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link href="/admin/orders" className="small text-white stretched-link">View Details</Link>
              <div className="small text-white"><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="row">
        <div className="col-xl-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-chart-bar me-1"></i>
              Monthly Revenue
            </div>
            <div className="card-body">
              {/* In a real app, we would use a chart library here */}
              <div className="text-center py-5">
                <p className="text-muted">Revenue chart would be displayed here</p>
                <div className="progress" style={{ height: '30px' }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">$3,217.31</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-graph-up me-1"></i>
              Sales Overview
            </div>
            <div className="card-body">
              {/* In a real app, we would use a chart library here */}
              <div className="text-center py-5">
                <p className="text-muted">Sales chart would be displayed here</p>
                <div className="d-flex justify-content-around">
                  <div className="text-center">
                    <div className="fw-bold fs-4">${stats.revenue.today.toFixed(2)}</div>
                    <div className="text-muted">Today</div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold fs-4">${stats.revenue.weekly.toFixed(2)}</div>
                    <div className="text-muted">This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold fs-4">${stats.revenue.monthly.toFixed(2)}</div>
                    <div className="text-muted">This Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tables Row */}
      <div className="row">
        <div className="col-xl-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-table me-1"></i>
              Recent Activity
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.map((activity, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`badge ${
                            activity.type === 'order' ? 'bg-success' : 
                            activity.type === 'product' ? 'bg-primary' : 
                            activity.type === 'user' ? 'bg-info' : 'bg-warning'
                          }`}>
                            {activity.type}
                          </span>
                        </td>
                        <td>{activity.user}</td>
                        <td>{activity.action}</td>
                        <td>{new Date(activity.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-star me-1"></i>
              Top Products
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 