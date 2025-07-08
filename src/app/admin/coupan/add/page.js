'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Local storage functions
const getCoupansFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminCoupans');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveCoupansToStorage = (coupans) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminCoupans', JSON.stringify(coupans));
  }
};

export default function AddCoupan() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    discount: '',
    minAmount: '',
    maxDiscount: '',
    expiry: '',
    usageLimit: '',
    description: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const coupanData = {
        ...formData,
        discount: parseFloat(formData.discount),
        minAmount: parseFloat(formData.minAmount) || 0,
        maxDiscount: parseFloat(formData.maxDiscount) || 0,
        usageLimit: parseInt(formData.usageLimit) || 0,
        usedCount: 0
      };

      console.log('Submitting coupan data:', coupanData);
      
      // Create new coupan with frontend-only approach
      const newCoupan = {
        _id: Date.now().toString(), // Generate unique ID
        ...coupanData,
        usedCount: 0,
        maxUses: parseInt(formData.usageLimit) || 0
      };
      
      // Get existing coupans and add new one
      const existingCoupans = getCoupansFromStorage();
      const updatedCoupans = [...existingCoupans, newCoupan];
      saveCoupansToStorage(updatedCoupans);
      
      setSuccess('Coupan created successfully!');
      setFormData({
        code: '',
        type: 'percent',
        discount: '',
        minAmount: '',
        maxDiscount: '',
        expiry: '',
        usageLimit: '',
        description: '',
        isActive: true
      });
      
      setTimeout(() => {
        router.push('/admin/coupan');
      }, 1500);
      
    } catch (err) {
      console.error('Error creating coupan:', err);
      setError(err.message || 'Failed to create coupan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Add New Coupan</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/admin/coupan">Coupans</a></li>
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
          <i className="bi bi-ticket-perforated me-1"></i>
          Coupan Information
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="code" className="form-label">Coupan Code*</label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="SAVE10"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="type" className="form-label">Discount Type*</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="discount" className="form-label">Discount Value*</label>
                <input
                  type="number"
                  className="form-control"
                  id="discount"
                  name="discount"
                  step="0.01"
                  min="0"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder={formData.type === 'percent' ? '10' : '50'}
                  required
                />
                <small className="text-muted">
                  {formData.type === 'percent' ? 'Enter percentage (e.g., 10 for 10%)' : 'Enter amount in ₹'}
                </small>
              </div>
              <div className="col-md-4">
                <label htmlFor="minAmount" className="form-label">Minimum Order Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id="minAmount"
                  name="minAmount"
                  step="0.01"
                  min="0"
                  value={formData.minAmount}
                  onChange={handleChange}
                  placeholder="100"
                />
                <small className="text-muted">Minimum cart value to apply coupan</small>
              </div>
              <div className="col-md-4">
                <label htmlFor="maxDiscount" className="form-label">Maximum Discount</label>
                <input
                  type="number"
                  className="form-control"
                  id="maxDiscount"
                  name="maxDiscount"
                  step="0.01"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  placeholder="100"
                />
                <small className="text-muted">Maximum discount amount (for percentage discounts)</small>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="expiry" className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="expiry"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="usageLimit" className="form-label">Usage Limit</label>
                <input
                  type="number"
                  className="form-control"
                  id="usageLimit"
                  name="usageLimit"
                  min="0"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="100"
                />
                <small className="text-muted">Maximum number of times this coupan can be used</small>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Save 10% on orders above ₹100"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isActive">
                  Active Coupan
                </label>
              </div>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary me-2"
                onClick={() => router.push('/admin/coupan')}
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
                  'Save Coupan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 