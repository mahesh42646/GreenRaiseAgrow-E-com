'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import adminApi from '../../../services/adminApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminApi.users.getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
    );
  });

  // Handle sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'email':
        aValue = a.email;
        bValue = b.email;
        break;
      case 'joined':
        aValue = new Date(a.joined);
        bValue = new Date(b.joined);
        break;
      case 'orders':
        aValue = a.orders;
        bValue = b.orders;
        break;
      case 'spent':
        aValue = a.spent;
        bValue = b.spent;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
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
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminApi.users.updateUserStatus(userId, newStatus);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminApi.users.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Users</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Users Management</li>
      </ol>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-people me-1"></i>
            User List
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search users..."
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
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('joined')} style={{ cursor: 'pointer' }}>
                    Joined {sortBy === 'joined' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('orders')} style={{ cursor: 'pointer' }}>
                    Orders {sortBy === 'orders' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('spent')} style={{ cursor: 'pointer' }}>
                    Spent {sortBy === 'spent' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold">{user.name}</div>
                            <small className="text-muted">{user.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{new Date(user.joined).toLocaleDateString()}</td>
                      <td>{user.orders}</td>
                      <td>${user.spent.toFixed(2)}</td>
                      <td>
                        <div className="dropdown">
                          <button 
                            className={`btn btn-sm dropdown-toggle ${
                              user.status === 'active' ? 'btn-success' : 'btn-danger'
                            }`}
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                          >
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(user.id, 'active')}
                                disabled={user.status === 'active'}
                              >
                                Set Active
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(user.id, 'inactive')}
                                disabled={user.status === 'inactive'}
                              >
                                Set Inactive
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link href={`/admin/users/${user.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
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
                      No users found
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
