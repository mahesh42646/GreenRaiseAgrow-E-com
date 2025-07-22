'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import adminApi from '../../../../services/adminApi';

export default function AddProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const isEditMode = Boolean(productId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [step, setStep] = useState(1);
  const [mediaFiles, setMediaFiles] = useState([]); // For multiple images/videos
  const [mediaPreviews, setMediaPreviews] = useState([]); // For preview URLs
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [thumbnailIdx, setThumbnailIdx] = useState(0);

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

  useEffect(() => {
    if (isEditMode) {
      (async () => {
        try {
          const product = await adminApi.products.getProductById(productId);
          setFormData({
            productName: product.productName || '',
            shortDescription: product.shortDescription || '',
            longDescription: product.longDescription || '',
            productCategory: product.productCategory || '',
            productSubcategory: product.productSubcategory || '',
            actualPrice: product.actualPrice?.toString() || '',
            discountedPrice: product.discountedPrice?.toString() || '',
            quantity: product.quantity?.toString() || '',
            skuNo: product.skuNo || '',
            stockStatus: product.stockStatus || 'In Stock',
            quantityStockLeft: product.quantityStockLeft?.toString() || '',
            productTags: (product.productTags || []).join(', '),
            adminEmail: product.adminEmail || 'admin@greenraise.com',
            isBestSeller: !!product.isBestSeller
          });
          // Set media and thumbnail
          setMediaFiles([]); // Can't restore File objects, so skip
          setMediaPreviews(product.media ? product.media.map(m => m.url) : []);
          setThumbnailIdx(product.media?.findIndex(m => m.url === product.productImage) ?? 0);
        } catch (err) {
          setError('Failed to load product for editing');
        }
      })();
    }
  }, [isEditMode, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (name === 'productImage') {
      setImagePreview(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, productImage: '' }));
    }
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews(prev => [...prev, ...newPreviews]);
    setDragActive(false);
    // If no thumbnail selected, set first image as thumbnail
    if (thumbnailIdx === null && files.length > 0) setThumbnailIdx(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMediaUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    if (thumbnailIdx === index) setThumbnailIdx(0);
    else if (thumbnailIdx > index) setThumbnailIdx(thumbnailIdx - 1);
  };

  const validateStep1 = () => {
    if (!formData.productName.trim() || !formData.productCategory.trim() || !formData.actualPrice) {
      setError('Please fill all required fields in Step 1.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      // Convert media files to base64 and type
      let mediaBase64 = [];
      if (mediaFiles.length > 0) {
        mediaBase64 = await Promise.all(mediaFiles.map(file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })));
      } else if (mediaPreviews.length > 0 && isEditMode) {
        // Use existing media URLs for edit mode if no new files
        mediaBase64 = mediaPreviews.map((url, idx) => ({
          type: url.endsWith('.mp4') || url.endsWith('.mov') ? 'video' : 'image',
          url
        }));
      }
      const thumbnail = mediaBase64[thumbnailIdx]?.url || '';
      if (isEditMode) {
        await submitEditProduct(mediaBase64, thumbnail);
      } else {
        await submitProduct(mediaBase64, thumbnail);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
      setIsSubmitting(false);
    }
  };

  const submitProduct = async (mediaBase64, thumbnail) => {
    const productData = {
      ...formData,
      actualPrice: parseFloat(formData.actualPrice),
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      quantity: parseInt(formData.quantity),
      quantityStockLeft: parseInt(formData.quantityStockLeft),
      productImage: thumbnail,
      media: mediaBase64,
      productTags: formData.productTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    await adminApi.products.createProduct(productData);
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
      skuNo: '',
      stockStatus: 'In Stock',
      quantityStockLeft: '',
      productTags: '',
      adminEmail: 'admin@greenraise.com',
      isBestSeller: false
    });
    setMediaFiles([]);
    setMediaPreviews([]);
    setThumbnailIdx(0);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1500);
    setIsSubmitting(false);
  };

  const submitEditProduct = async (mediaBase64, thumbnail) => {
    const productData = {
      ...formData,
      actualPrice: parseFloat(formData.actualPrice),
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      quantity: parseInt(formData.quantity),
      quantityStockLeft: parseInt(formData.quantityStockLeft),
      productImage: thumbnail,
      media: mediaBase64,
      productTags: formData.productTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    await adminApi.products.updateProduct(productId, productData);
    setSuccess('Product updated successfully!');
    setTimeout(() => {
      router.push('/admin/products');
    }, 1500);
    setIsSubmitting(false);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/admin/products">Products</a></li>
        <li className="breadcrumb-item active">Add New</li>
      </ol>
      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">{success}</div>
      )}
      <div className="card mb-4">
        <div className="card-header">
          <i className="bi bi-box-seam me-1"></i>
          Product Information
        </div>
        <div className="card-body">
          <div className="mb-4 d-flex align-items-center">
            <div className="me-3">
              <span className={`badge rounded-pill ${step === 1 ? 'bg-primary' : 'bg-secondary'}`}>Step 1</span>
            </div>
            <div style={{ width: 40, height: 2, background: '#ccc' }}></div>
            <div className="ms-3">
              <span className={`badge rounded-pill ${step === 2 ? 'bg-primary' : 'bg-secondary'}`}>Step 2</span>
            </div>
          </div>
          <form onSubmit={step === 1 ? handleNext : handleSubmit}>
            {step === 1 && (
              <div className="row g-4 align-items-stretch">
                <div className="col-md-6 border-end pe-4 d-flex flex-column justify-content-center" style={{ minHeight: 480 }}>
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3" style={{ color: '#08A486' }}>Basic Product Info</h4>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="productName" className="form-label">Product Name<span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-lg shadow-sm" id="productName" name="productName" value={formData.productName} onChange={handleChange} required placeholder="e.g. Organic Bamboo Toothbrush" />
                    <button type="button" className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0" tabIndex={-1} title="Enter the main product name as shown to customers."><i className="bi bi-info-circle"></i></button>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="actualPrice" className="form-label">Price (₹)<span className="text-danger">*</span></label>
                    <input type="number" className="form-control form-control-lg shadow-sm" id="actualPrice" name="actualPrice" step="0.01" min="0" value={formData.actualPrice} onChange={handleChange} required placeholder="e.g. 199" />
                    <button type="button" className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0" tabIndex={-1} title="Set the selling price in INR."><i className="bi bi-info-circle"></i></button>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="productCategory" className="form-label">Category<span className="text-danger">*</span></label>
                    <select className="form-select form-select-lg shadow-sm" id="productCategory" name="productCategory" value={formData.productCategory} onChange={handleChange} required>
                      <option value="">Select Category</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Food & Beverages">Food & Beverages</option>
                    </select>
                    <button type="button" className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0" tabIndex={-1} title="Choose the main category for this product."><i className="bi bi-info-circle"></i></button>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="skuNo" className="form-label">SKU Number</label>
                    <input type="text" className="form-control form-control-lg shadow-sm" id="skuNo" name="skuNo" value={formData.skuNo} onChange={handleChange} placeholder="e.g. SKU12345" />
                    <button type="button" className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0" tabIndex={-1} title="Stock Keeping Unit for inventory tracking (optional)."><i className="bi bi-info-circle"></i></button>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="productSubcategory" className="form-label">Subcategory</label>
                    <input type="text" className="form-control form-control-lg shadow-sm" id="productSubcategory" name="productSubcategory" value={formData.productSubcategory} onChange={handleChange} placeholder="e.g. Eco-Friendly" />
                    <button type="button" className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0" tabIndex={-1} title="Further classify the product (optional)."><i className="bi bi-info-circle"></i></button>
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="shortDescription" className="form-label">Short Description</label>
                    <input type="text" className="form-control form-control-lg shadow-sm" id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="e.g. 100% biodegradable, eco-friendly" />
                    <button type="button" className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0" tabIndex={-1} title="A brief summary for quick view (optional)."><i className="bi bi-info-circle"></i></button>
                  </div>
                </div>
                <div className="col-md-6 ps-4 d-flex flex-column justify-content-center" style={{ minHeight: 480 }}>
                  <label className="form-label fw-bold mb-2" style={{ color: '#08A486' }}>Product Media (Images/Videos)</label>
                  <div
                    className={`rounded-4 border border-2 p-4 mb-3 d-flex flex-column align-items-center justify-content-center position-relative shadow-sm ${dragActive ? 'border-success bg-light' : 'border-secondary bg-white'}`}
                    style={{ minHeight: 220, cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                    onClick={openFileDialog}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="d-none"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaUpload}
                    />
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ pointerEvents: 'none' }}>
                      <i className="bi bi-cloud-arrow-up display-4 mb-2" style={{ color: dragActive ? '#08A486' : '#aaa', transition: 'color 0.2s' }}></i>
                      <span className="fw-semibold" style={{ color: dragActive ? '#08A486' : '#555' }}>
                        {dragActive ? 'Drop files here' : 'Click or drag & drop to upload'}
                      </span>
                      <span className="small text-muted">JPG, PNG, GIF, WebP, MP4, MOV supported</span>
                    </div>
                  </div>
                  <div className="row g-3">
                    {mediaPreviews.map((url, idx) => (
                      <div className="col-4 position-relative group" key={idx} style={{ minHeight: 100, cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                        <div
                          className={`rounded-3 overflow-hidden position-relative border ${thumbnailIdx === idx ? 'border-success border-3 shadow-lg' : 'border-0 shadow-sm'}`}
                          style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}
                          onClick={e => { e.stopPropagation(); setThumbnailIdx(idx); }}
                          title={thumbnailIdx === idx ? 'Thumbnail (Main Image)' : 'Set as thumbnail'}
                        >
                          {mediaFiles[idx] && mediaFiles[idx].type.startsWith('video') ? (
                            <video src={url} controls style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                          ) : (
                            <Image src={url} alt={`media-${idx}`} width={100} height={100} style={{ objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: 6, right: 6, zIndex: 2, borderRadius: '50%', width: 28, height: 28, padding: 0, fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.10)', opacity: 0.92, transition: 'opacity 0.2s' }}
                            onClick={e => { e.stopPropagation(); removeMedia(idx); }}
                            title="Remove"
                          >&times;</button>
                          {thumbnailIdx === idx && (
                            <span className="badge bg-success position-absolute top-0 start-0 m-1" style={{ zIndex: 3, fontSize: 12 }}>Thumbnail</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                <div className="mb-3">
                  <label htmlFor="longDescription" className="form-label">Long Description*</label>
                  <textarea className="form-control" id="longDescription" name="longDescription" rows="4" value={formData.longDescription} onChange={handleChange}></textarea>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="discountedPrice" className="form-label">Discounted Price (₹)</label>
                    <input type="number" className="form-control" id="discountedPrice" name="discountedPrice" step="0.01" min="0" value={formData.discountedPrice} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="quantity" className="form-label">Total Quantity*</label>
                    <input type="number" className="form-control" id="quantity" name="quantity" min="0" value={formData.quantity} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="quantityStockLeft" className="form-label">Stock Left*</label>
                    <input type="number" className="form-control" id="quantityStockLeft" name="quantityStockLeft" min="0" value={formData.quantityStockLeft} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="stockStatus" className="form-label">Stock Status*</label>
                    <select className="form-select" id="stockStatus" name="stockStatus" value={formData.stockStatus} onChange={handleChange} required>
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="productTags" className="form-label">Tags <small className="text-muted">(comma-separated)</small></label>
                  <input type="text" className="form-control" id="productTags" name="productTags" value={formData.productTags} onChange={handleChange} placeholder="eco-friendly, sustainable, organic" />
                </div>
                <div className="mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="isBestSeller" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="isBestSeller">Best Seller</label>
                  </div>
                </div>
                <div className="mb-3 d-none">
                  <label htmlFor="adminEmail" className="form-label">Admin Email*</label>
                  <input type="email" className="form-control" id="adminEmail" name="adminEmail" value={formData.adminEmail} onChange={handleChange} required />
                </div>
              </>
            )}
            <div className="d-flex justify-content-end">
              {step === 2 && (
                <button type="button" className="btn btn-outline-secondary me-2" onClick={handleBack} disabled={isSubmitting}>Back</button>
              )}
              <button type="button" className="btn btn-outline-secondary me-2" onClick={() => router.push('/admin/products')} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : (step === 1 ? 'Next' : 'Save Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
