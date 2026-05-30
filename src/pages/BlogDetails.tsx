import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/public/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to fetch blog', err);
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00674F]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-[#FAFAFA] text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{error}</h2>
        <Link to="/blog" className="text-[#00674F] hover:underline font-semibold flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        
        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-[#00674F] mb-8 font-medium transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to all posts
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Image */}
          {blog.image_url && (
            <div className="w-full h-[400px] bg-gray-100 relative">
              <img 
                src={blog.image_url} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Meta info */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-x-6">
              <span className="flex items-center"><Calendar size={16} className="mr-2 text-[#00674F]" /> {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center"><User size={16} className="mr-2 text-[#00674F]" /> {blog.author || 'Admin'}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700">
              {/* Splitting by newline to create paragraphs for simple text rendering */}
              {blog.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
