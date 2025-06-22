'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import adminApi from '../../../services/adminApi';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await adminApi.tickets.getAllTickets();
        setTickets(data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Handle search and filter
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle sorting
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'subject':
        aValue = a.subject;
        bValue = b.subject;
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
  const currentItems = sortedTickets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await adminApi.tickets.updateTicket(ticketId, { status: newStatus });
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      alert('Failed to update ticket status');
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const ticket = await adminApi.tickets.getTicketById(ticketId);
      setSelectedTicket(ticket);
      setResponseText(ticket.responseMessage || '');
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      alert('Failed to load ticket details');
    }
  };

  const handleCloseTicket = () => {
    setSelectedTicket(null);
    setResponseText('');
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    if (!responseText.trim()) {
      alert('Please enter a response message');
      return;
    }
    
    try {
      await adminApi.tickets.updateTicket(selectedTicket.id, {
        status: 'responded',
        responseMessage: responseText,
        respondedBy: 'Admin User'
      });
      
      // Update the ticket in the list
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? {
          ...ticket,
          status: 'responded',
          responseMessage: responseText,
          responseDate: new Date().toISOString()
        } : ticket
      ));
      
      // Update the selected ticket
      setSelectedTicket({
        ...selectedTicket,
        status: 'responded',
        responseMessage: responseText,
        responseDate: new Date().toISOString()
      });
      
      alert('Response sent successfully');
    } catch (err) {
      console.error('Error sending response:', err);
      alert('Failed to send response');
    }
  };

  // Get unique statuses for filter
  const statuses = ['All', 'new', 'read', 'responded', 'closed'];

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
      <h1 className="mt-4">Support Tickets</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Ticket Management</li>
      </ol>
      
      {selectedTicket ? (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-ticket-perforated me-1"></i>
              Ticket Details
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleCloseTicket}>
              Back to List
            </button>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h5>From: {selectedTicket.name}</h5>
                <p className="mb-1">
                  <strong>Email:</strong> {selectedTicket.email}
                </p>
                {selectedTicket.phone && (
                  <p className="mb-1">
                    <strong>Phone:</strong> {selectedTicket.phone}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Date:</strong> {new Date(selectedTicket.date).toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>
                  <span 
                    className={`badge ms-2 ${
                      selectedTicket.status === 'new' ? 'bg-danger' :
                      selectedTicket.status === 'read' ? 'bg-warning' :
                      selectedTicket.status === 'responded' ? 'bg-info' : 'bg-success'
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    Change Status
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusChange(selectedTicket.id, 'new')}
                        disabled={selectedTicket.status === 'new'}
                      >
                        Mark as New
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusChange(selectedTicket.id, 'read')}
                        disabled={selectedTicket.status === 'read'}
                      >
                        Mark as Read
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                        disabled={selectedTicket.status === 'closed'}
                      >
                        Close Ticket
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Subject: {selectedTicket.subject}</h6>
              </div>
              <div className="card-body">
                <p>{selectedTicket.message}</p>
              </div>
            </div>
            
            {selectedTicket.responseMessage && (
              <div className="card mb-4 border-info">
                <div className="card-header bg-info bg-opacity-10">
                  <h6 className="mb-0">Response</h6>
                </div>
                <div className="card-body">
                  <p>{selectedTicket.responseMessage}</p>
                  <div className="text-muted mt-2">
                    <small>
                      Responded by {selectedTicket.respondedBy || 'Admin'} on {new Date(selectedTicket.responseDate).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmitResponse}>
              <div className="mb-3">
                <label htmlFor="responseText" className="form-label">Your Response</label>
                <textarea
                  id="responseText"
                  className="form-control"
                  rows="5"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send Response
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-ticket-perforated me-1"></i>
              Ticket List
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search tickets..."
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
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                      Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('subject')} style={{ cursor: 'pointer' }}>
                      Subject {sortBy === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{new Date(ticket.date).toLocaleString()}</td>
                        <td>
                          <div className="fw-bold">{ticket.name}</div>
                          <small className="text-muted">{ticket.email}</small>
                        </td>
                        <td>{ticket.subject}</td>
                        <td>
                          <span 
                            className={`badge ${
                              ticket.status === 'new' ? 'bg-danger' :
                              ticket.status === 'read' ? 'bg-warning' :
                              ticket.status === 'responded' ? 'bg-info' : 'bg-success'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewTicket(ticket.id)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleStatusChange(ticket.id, 'read')}
                              disabled={ticket.status !== 'new'}
                            >
                              <i className="bi bi-check"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleStatusChange(ticket.id, 'closed')}
                              disabled={ticket.status === 'closed'}
                            >
                              <i className="bi bi-archive"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No tickets found
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
      )}
    </div>
  );
} 