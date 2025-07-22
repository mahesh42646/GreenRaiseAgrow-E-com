'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import adminApi from '../../../services/adminApi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await adminApi.products.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search
  const filteredProducts = products.filter((product) => {
    return (
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toString().includes(searchTerm)
    );
  });

  // Handle sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.productName;
        bValue = b.productName;
        break;
      case 'price':
        aValue = a.actualPrice;
        bValue = b.actualPrice;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'stock':
        aValue = a.quantityStockLeft || 0;
        bValue = b.quantityStockLeft || 0;
        break;
      default:
        aValue = a.productName;
        bValue = b.productName;
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
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.products.deleteProduct(productId);
        setProducts(products.filter(product => product.productId !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
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
        <h1 className="mt-4">Products</h1>
        <Link href="/admin/products/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Add Product
        </Link>
      </div>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-table me-1"></i>
            Product List
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search products..."
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
                  <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                    Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <div className="d-flex align-items-center  ">
                          <Image 
                            src={product.productImage ? product.productImage : 'https://via.placeholder.com/50'} 
                            alt={product.productName} 
                            className="me-2 border rounded-5" 
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                            unoptimized={true}
                          />
                          <div>
                            <div className="fw-bold">{product.productName}</div>
                            {/* <small className="text-muted">ID: {product.productId}</small> */}
                          </div>
                        </div>
                      </td>
                      <td className="pt-4">{product.productCategory}</td>
                      <td>
                        {product.discountedPrice && product.discountedPrice < product.actualPrice ? (
                          <div>
                            <div className="fw-bold fs-6 pt-3"> ₹{(product.actualPrice - product.discountedPrice).toFixed(2)}</div>
                            {/* <div className="text-decoration-line-through text-muted small">
                              ₹{product.actualPrice.toFixed(2)}
                            </div> */}
                            {/* <div className="text-danger small ">
                            ₹{product.discountedPrice.toFixed(2)}off
                            </div> */}
                          </div>
                        ) : (
                          <div className="fw-bold">₹{product.actualPrice.toFixed(2)}</div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${product.stockStatus === 'In Stock' ? 'bg-success' : 'bg-danger'} mt-3`}>
                          {product.stockStatus === 'In Stock' ? `${product.quantityStockLeft} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group mt-2">
                          <Link href={`/admin/products/add/${product.productId}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product.productId)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No products found
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





