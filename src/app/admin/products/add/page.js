'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import adminApi from '../../../../services/adminApi';

export default function AddProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    shortDescription: '',
    longDescription: '',
    productCategory: '',
    productSubcategory: '',
    actualPrice: '',
    discountedPrice: '',
    quantity: '',
    productImage: '',
    skuNo: '',
    stockStatus: 'In Stock',
    quantityStockLeft: '',
    productTags: '',
    adminEmail: 'admin@greenraise.com',
    isBestSeller: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Update image preview when URL changes
    if (name === 'productImage') {
      setImagePreview(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Create preview URL for uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear URL input when file is uploaded
      setFormData(prev => ({
        ...prev,
        productImage: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.productImage;
      
      // If file is uploaded, convert to base64 or upload to server
      if (uploadedFile) {
        // For now, we'll convert to base64 (in production, upload to cloud storage)
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          finalImageUrl = base64Image;
          
          // Submit with base64 image
          await submitProduct(finalImageUrl);
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        // Submit with URL
        await submitProduct(finalImageUrl);
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
      setIsSubmitting(false);
    }
  };

  const submitProduct = async (imageUrl) => {
    // Convert prices and quantities to numbers
    const productData = {
      ...formData,
      actualPrice: parseFloat(formData.actualPrice),
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      quantity: parseInt(formData.quantity),
      quantityStockLeft: parseInt(formData.quantityStockLeft),
      productImage: imageUrl ? [imageUrl] : [],
      productTags: formData.productTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    console.log('Submitting product data:', productData);
    const response = await adminApi.products.createProduct(productData);
    
    setSuccess('Product created successfully!');
    setFormData({
      productName: '',
      shortDescription: '',
      longDescription: '',
      productCategory: '',
      productSubcategory: '',
      actualPrice: '',
      discountedPrice: '',
      quantity: '',
      productImage: '',
      skuNo: '',
      stockStatus: 'In Stock',
      quantityStockLeft: '',
      productTags: '',
      adminEmail: 'admin@greenraise.com',
      isBestSeller: false
    });
    setImagePreview('');
    setUploadedFile(null);
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/admin/products');
    }, 1500);
    
    setIsSubmitting(false);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Add New Product</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/admin/products">Products</a></li>
        <li className="breadcrumb-item active">Add New</li>
      </ol>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header">
          <i className="bi bi-box-seam me-1"></i>
          Product Information
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="productName" className="form-label">Product Name*</label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="skuNo" className="form-label">SKU Number*</label>
                <input
                  type="text"
                  className="form-control"
                  id="skuNo"
                  name="skuNo"
                  value={formData.skuNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="productCategory" className="form-label">Category*</label>
                <select
                  className="form-select"
                  id="productCategory"
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="productSubcategory" className="form-label">Subcategory*</label>
                <input
                  type="text"
                  className="form-control"
                  id="productSubcategory"
                  name="productSubcategory"
                  value={formData.productSubcategory}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="shortDescription" className="form-label">Short Description*</label>
              <input
                type="text"
                className="form-control"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="longDescription" className="form-label">Long Description*</label>
              <textarea
                className="form-control"
                id="longDescription"
                name="longDescription"
                rows="4"
                value={formData.longDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-3">
                <label htmlFor="actualPrice" className="form-label">Price (₹)*</label>
                <input
                  type="number"
                  className="form-control"
                  id="actualPrice"
                  name="actualPrice"
                  step="0.01"
                  min="0"
                  value={formData.actualPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="discountedPrice" className="form-label">Discounted Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  id="discountedPrice"
                  name="discountedPrice"
                  step="0.01"
                  min="0"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="quantity" className="form-label">Total Quantity*</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="quantityStockLeft" className="form-label">Stock Left*</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantityStockLeft"
                  name="quantityStockLeft"
                  min="0"
                  value={formData.quantityStockLeft}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="stockStatus" className="form-label">Stock Status*</label>
                <select
                  className="form-select"
                  id="stockStatus"
                  name="stockStatus"
                  value={formData.stockStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="col-md-6 display-hide">
                <label htmlFor="adminEmail" className="form-label">Admin Email*</label>
                <input
                  type="email"
                  className="form-control"
                  id="adminEmail"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="productImage" className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="productImage"
                  name="productImage"
                  value={formData.productImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={uploadedFile}
                />
                <small className="text-muted">Enter image URL or upload a file below</small>
              </div>
              <div className="col-md-6">
                <label htmlFor="imageFile" className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={formData.productImage}
                />
                <small className="text-muted">Supported formats: JPG, PNG, GIF, WebP</small>
              </div>
            </div>
            
            {imagePreview && (
              <div className="mb-3">
                <label className="form-label">Image Preview</label>
                <div className="d-flex align-items-center">
                  <div style={{ position: 'relative', width: '150px', height: '150px', marginRight: '15px' }}>
                    <Image 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="img-thumbnail" 
                      fill
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                      }}
                    />
                  </div>
                  <div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setImagePreview('');
                        setUploadedFile(null);
                        setFormData(prev => ({ ...prev, productImage: '' }));
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-3">
              <label htmlFor="productTags" className="form-label">Tags <small className="text-muted">(comma-separated)</small></label>
              <input
                type="text"
                className="form-control"
                id="productTags"
                name="productTags"
                value={formData.productTags}
                onChange={handleChange}
                placeholder="eco-friendly, sustainable, organic"
              />
            </div>
            
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isBestSeller"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isBestSeller">
                  Best Seller
                </label>
              </div>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary me-2"
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
