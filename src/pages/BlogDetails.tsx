import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      <div className="w-full min-h-screen bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] flex items-center justify-center">
        <div className="p-20 text-center animate-pulse text-[#00ffc4] font-bold text-lg">
          Loading Blog Details...
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">{error}</h2>
        <button 
          onClick={() => navigate('/blog')} 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-[#00ffc4]/15 border border-white/10 hover:border-[#00ffc4]/30 text-emerald-100 hover:text-white transition-all duration-300 shadow-sm"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Back to Blogs</span>
        </button>
      </div>
    );
  }

  const readingTime = blog.content ? `${Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))} min read` : '1 min read';

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] text-gray-800 flex flex-col antialiased relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes float-detail-blob {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1); }
          50% { transform: translate3d(-30px, 20px, 0) scale(1.08); }
        }
        @keyframes float-detail-blob-2 {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1.05); }
          50% { transform: translate3d(20px, -30px, 0) scale(0.92); }
        }
        .animate-detail-blob {
          animation: float-detail-blob 12s ease-in-out infinite;
          will-change: transform;
        }
        .animate-detail-blob-2 {
          animation: float-detail-blob-2 15s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Drifting gradient blur background elements */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-detail-blob"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-detail-blob-2"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        {/* Back Navigation Button */}
        <button 
          onClick={() => navigate('/blog')} 
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-[#00ffc4]/15 border border-white/10 hover:border-[#00ffc4]/30 text-emerald-100 hover:text-white transition-all duration-300 shadow-sm group hover:-translate-y-0.5"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Back to Blogs</span>
        </button>

        <article className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden relative">
          {/* Colorful top brand gradient line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00ffc4] via-[#00674F] to-yellow-400"></div>

          {/* Header Image */}
          {blog.image_url && (
            <div className="w-full h-[300px] md:h-[450px] bg-slate-900 relative overflow-hidden">
              <img 
                src={getImageUrl(blog.image_url)} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
            </div>
          )}

          <div className="p-6 sm:p-10 md:p-14">
            {/* Meta info tags */}
            <div className="flex flex-wrap items-center text-xs font-semibold text-gray-500 gap-4 mb-6">
              <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-gray-650">
                <Calendar size={13} className="mr-1.5 text-[#00674F]" /> 
                {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-gray-650">
                <User size={13} className="mr-1.5 text-[#00674F]" /> 
                {blog.author || 'Admin'}
              </span>
              <span className="flex items-center bg-emerald-50 text-[#00674F] border border-emerald-100 px-3 py-1.5 rounded-full">
                <Clock size={13} className="mr-1.5 text-[#00674F]" /> 
                {readingTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Content paragraph system */}
            <div className="prose prose-lg max-w-none text-gray-750 font-sans leading-relaxed space-y-6">
              {blog.content.split('\n').map((paragraph: string, index: number) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                return (
                  <p key={index} className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
