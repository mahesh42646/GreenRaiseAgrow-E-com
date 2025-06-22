'use client';

import { useState, useEffect } from "react";
import { blogAPI } from "../../../services/api";
import Link from "next/link";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getAllBlogs();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Blog</h1>
          <p className="lead">
            Stay updated with our latest news and articles about sustainability.
          </p>
          
          {blogs.length === 0 ? (
            <div className="alert alert-info">
              No blog posts found. Check back later for new content!
            </div>
          ) : (
            <div className="row mt-4">
              {blogs.map((blog) => (
                <div key={blog.blogId} className="col-md-4 mb-4">
                  <div className="card h-100">
                    {blog.featuredImage && (
                      <img 
                        src={blog.featuredImage} 
                        className="card-img-top" 
                        alt={blog.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link href={`/blog/${blog.slug}`} className="text-decoration-none text-dark">
                          {blog.title}
                        </Link>
                      </h5>
                      <p className="text-muted mb-2">
                        {new Date(blog.publishDate || blog.createdAt).toLocaleDateString()} | {blog.author}
                      </p>
                      <p className="card-text">{blog.excerpt}</p>
                      <Link 
                        href={`/blog/${blog.slug}`} 
                        className="text-decoration-none" 
                        style={{ color: '#08A486' }}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 