'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '../../../../services/adminApi';

export default function AddBlog() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    authorEmail: '',
    featuredImage: '',
    category: '',
    tags: '',
    status: 'draft',
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    readTime: 5
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      metaTitle: title // Set meta title same as title by default
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      console.log('Submitting blog data...');
      
      // Format data according to backend model requirements
      const blogData = {
        ...formData,
        publishDate: formData.status === 'published' ? new Date().toISOString() : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        readTime: parseInt(formData.readTime) || 5
      };

      console.log('Blog data being sent:', blogData);
      const response = await adminApi.blogs.createBlog(blogData);
      
      setSuccess('Blog post created successfully!');
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: '',
        authorEmail: '',
        featuredImage: '',
        category: '',
        tags: '',
        status: 'draft',
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        readTime: 5
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/blogs');
      }, 1500);
      
    } catch (err) {
      console.error('Error creating blog post:', err);
      setError(err.message || 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Add New Blog Post</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/admin/blogs">Blogs</a></li>
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
          <i className="bi bi-file-earmark-text me-1"></i>
          Blog Post Information
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="title" className="form-label">Title*</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="slug" className="form-label">Slug* <small className="text-muted">(URL-friendly identifier)</small></label>
                <input
                  type="text"
                  className="form-control"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">Auto-generated from title, can be edited</small>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="author" className="form-label">Author*</label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="authorEmail" className="form-label">Author Email*</label>
                <input
                  type="email"
                  className="form-control"
                  id="authorEmail"
                  name="authorEmail"
                  value={formData.authorEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="category" className="form-label">Category*</label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Sustainable Living">Sustainable Living</option>
                  <option value="Eco Products">Eco Products</option>
                  <option value="Gardening">Gardening</option>
                  <option value="Climate Action">Climate Action</option>
                  <option value="Zero Waste">Zero Waste</option>
                  <option value="Green Energy">Green Energy</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">Status*</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="excerpt" className="form-label">Excerpt* <small className="text-muted">(Short summary)</small></label>
              <textarea
                className="form-control"
                id="excerpt"
                name="excerpt"
                rows="2"
                value={formData.excerpt}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content*</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="10"
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="featuredImage" className="form-label">Featured Image URL*</label>
              <input
                type="url"
                className="form-control"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                required
              />
              {formData.featuredImage && (
                <div className="mt-2">
                  <img 
                    src={formData.featuredImage} 
                    alt="Blog preview" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '200px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="tags" className="form-label">Tags <small className="text-muted">(comma-separated)</small></label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="sustainability, eco-friendly, green living"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="readTime" className="form-label">Read Time (minutes)*</label>
                <input
                  type="number"
                  className="form-control"
                  id="readTime"
                  name="readTime"
                  min="1"
                  value={formData.readTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isFeatured">
                  Featured Post
                </label>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="metaTitle" className="form-label">Meta Title <small className="text-muted">(SEO)</small></label>
              <input
                type="text"
                className="form-control"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="metaDescription" className="form-label">Meta Description <small className="text-muted">(SEO)</small></label>
              <textarea
                className="form-control"
                id="metaDescription"
                name="metaDescription"
                rows="2"
                value={formData.metaDescription}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary me-2"
                onClick={() => router.push('/admin/blogs')}
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
                  'Publish Blog Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
