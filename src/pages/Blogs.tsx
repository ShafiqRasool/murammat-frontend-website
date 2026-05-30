import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Calendar, User } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/public/blogs');
        setBlogs(res.data);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Murammat <span className="text-[#00674F]">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover tips, guides, and stories about home maintenance, repairs, and improvements.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00674F]"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xl font-medium">No blog posts available yet.</p>
            <p className="mt-2">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                to={`/blog/${blog.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col"
              >
                {/* Image Section */}
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                  {blog.image_url ? (
                    <img 
                      src={blog.image_url} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#00674F]/5">
                      <span className="text-[#00674F]/30 font-bold text-xl">Murammat</span>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center"><User size={14} className="mr-1" /> {blog.author || 'Admin'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00674F] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 text-sm mb-4 flex-1">
                    {blog.content}
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#00674F] font-semibold text-sm flex items-center">
                      Read More <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
