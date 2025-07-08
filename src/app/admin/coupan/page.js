'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for initial state
const mockCoupans = [
  {
    _id: '1',
    code: 'SAVE20',
    type: 'percent',
    discount: 20,
    expiry: '2024-12-31',
    minAmount: 100,
    maxUses: 100,
    usedCount: 15,
    isActive: true
  },
  {
    _id: '2',
    code: 'FLAT50',
    type: 'fixed',
    discount: 50,
    expiry: '2024-11-30',
    minAmount: 200,
    maxUses: 50,
    usedCount: 8,
    isActive: true
  },
  {
    _id: '3',
    code: 'WELCOME10',
    type: 'percent',
    discount: 10,
    expiry: '2024-10-15',
    minAmount: 50,
    maxUses: 200,
    usedCount: 45,
    isActive: false
  }
];

// Local storage functions
const getCoupansFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminCoupans');
    return stored ? JSON.parse(stored) : mockCoupans;
  }
  return mockCoupans;
};

const saveCoupansToStorage = (coupans) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminCoupans', JSON.stringify(coupans));
  }
};

export default function AdminCoupans() {
  const [coupans, setCoupans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('code');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCoupans = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getCoupansFromStorage();
        setCoupans(data);
      } catch (err) {
        console.error('Error fetching coupans:', err);
        setError('Failed to load coupans');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupans();
  }, []);

  const filteredCoupans = coupans.filter((coupan) => {
    return (
      coupan.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupan.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedCoupans = [...filteredCoupans].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'code':
        aValue = a.code;
        bValue = b.code;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'discount':
        aValue = a.discount;
        bValue = b.discount;
        break;
      case 'expiry':
        aValue = a.expiry;
        bValue = b.expiry;
        break;
      default:
        aValue = a.code;
        bValue = b.code;
    }
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCoupans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCoupans.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (coupanId) => {
    if (window.confirm('Are you sure you want to delete this coupan?')) {
      try {
        const updatedCoupans = coupans.filter(coupan => coupan._id !== coupanId);
        setCoupans(updatedCoupans);
        saveCoupansToStorage(updatedCoupans);
      } catch (err) {
        console.error('Error deleting coupan:', err);
        alert('Failed to delete coupan');
      }
    }
  };

  const handleToggleStatus = (coupanId) => {
    const updatedCoupans = coupans.map(coupan => 
      coupan._id === coupanId 
        ? { ...coupan, isActive: !coupan.isActive }
        : coupan
    );
    setCoupans(updatedCoupans);
    saveCoupansToStorage(updatedCoupans);
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mt-4">Coupans</h1>
        <Link href="/admin/coupan/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Add Coupan
        </Link>
      </div>
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-table me-1"></i>
            Coupan List
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search coupans..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('code')} style={{ cursor: 'pointer' }}>
                    Code {sortBy === 'code' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                    Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('discount')} style={{ cursor: 'pointer' }}>
                    Discount {sortBy === 'discount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('expiry')} style={{ cursor: 'pointer' }}>
                    Expiry {sortBy === 'expiry' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Status</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((coupan) => (
                    <tr key={coupan._id}>
                      <td>
                        <span className="fw-bold">{coupan.code}</span>
                        <br />
                        <small className="text-muted">Min: ₹{coupan.minAmount}</small>
                      </td>
                      <td>
                        <span className={`badge ${coupan.type === 'percent' ? 'bg-info' : 'bg-success'}`}>
                          {coupan.type}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold">
                          {coupan.discount}{coupan.type === 'percent' ? '%' : '₹'}
                        </span>
                      </td>
                      <td>
                        {coupan.expiry ? new Date(coupan.expiry).toLocaleDateString() : '-'}
                        <br />
                        <small className={`text-${new Date(coupan.expiry) < new Date() ? 'danger' : 'muted'}`}>
                          {new Date(coupan.expiry) < new Date() ? 'Expired' : 'Active'}
                        </small>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={coupan.isActive}
                            onChange={() => handleToggleStatus(coupan._id)}
                          />
                          <label className="form-check-label">
                            {coupan.isActive ? 'Active' : 'Inactive'}
                          </label>
                        </div>
                      </td>
                      <td>
                        <small>
                          {coupan.usedCount}/{coupan.maxUses}
                        </small>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar" 
                            style={{ width: `${(coupan.usedCount / coupan.maxUses) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link href={`/admin/coupan/edit/${coupan._id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(coupan._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No coupans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
