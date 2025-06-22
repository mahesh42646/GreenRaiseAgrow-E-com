'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import adminApi from '../../../services/adminApi';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await adminApi.blogs.getAllBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle search
  const filteredBlogs = blogs.filter((blog) => {
    return (
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await adminApi.blogs.deleteBlog(blogId);
        setBlogs(blogs.filter(blog => blog.id !== blogId));
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog post');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mt-4">Blog Posts</h1>
        <Link href="/admin/blogs/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Add Blog Post
        </Link>
      </div>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-file-earmark-text me-1"></i>
            Blog Post List
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="card-body">
          {currentItems.length > 0 ? (
            currentItems.map((blog) => (
              <div key={blog.id} className="card mb-3 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img 
                      src={blog.imageUrl || 'https://via.placeholder.com/300x200?text=Blog+Image'} 
                      className="img-fluid rounded-start" 
                      alt={blog.title}
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title">{blog.title}</h5>
                        <div className="badge bg-primary">{blog.category}</div>
                      </div>
                      <p className="card-text text-muted small">
                        <i className="bi bi-person me-1"></i> {blog.author} | 
                        <i className="bi bi-calendar3 ms-2 me-1"></i> {new Date(blog.date).toLocaleDateString()}
                      </p>
                      <p className="card-text">{blog.content.substring(0, 150)}...</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="badge bg-secondary me-2">
                            <i className="bi bi-eye me-1"></i> {blog.views || 0}
                          </span>
                          <span className="badge bg-secondary">
                            <i className="bi bi-chat-dots me-1"></i> {blog.comments?.length || 0}
                          </span>
                        </div>
                        <div className="btn-group">
                          <Link href={`/blog/${blog.id}`} className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link href={`/admin/blogs/edit/${blog.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(blog.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-journal-x fs-1 text-muted"></i>
              <p className="mt-2">No blog posts found</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
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