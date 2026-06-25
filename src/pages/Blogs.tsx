import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Calendar, User, Sparkles } from 'lucide-react';

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getCategoryTag = (title: string) => {
  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes('clean')) return 'Cleaning Tips';
  if (lowercaseTitle.includes('plumb') || lowercaseTitle.includes('leak')) return 'Plumbing Care';
  if (lowercaseTitle.includes('electr') || lowercaseTitle.includes('wire')) return 'Electrical Safety';
  if (lowercaseTitle.includes('diy') || lowercaseTitle.includes('how to')) return 'DIY Guides';
  return 'Home Care';
};

const SkeletonCard = () => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 animate-pulse space-y-4 shadow-xl">
    <div className="h-48 w-full bg-white/10 rounded-xl"></div>
    <div className="flex items-center space-x-4">
      <div className="h-3 w-20 bg-white/10 rounded"></div>
      <div className="h-3 w-16 bg-white/10 rounded"></div>
    </div>
    <div className="h-6 w-3/4 bg-white/10 rounded"></div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-white/10 rounded"></div>
      <div className="h-4 w-5/6 bg-white/10 rounded"></div>
    </div>
  </div>
);

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
    <div className="w-full min-h-screen bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] text-white flex flex-col antialiased relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes float-blog-blob {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1); }
          50% { transform: translate3d(-20px, 30px, 0) scale(1.05); }
        }
        .animate-blog-blob {
          animation: float-blog-blob 15s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Background drifting glow elements */}
      <div className="absolute top-[15%] left-[-10%] w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-blog-blob"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-blog-blob" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 bg-[#00ffc4]/10 text-[#00ffc4] border border-[#00ffc4]/20 text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={11} className="animate-pulse" />
            Our Latest Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Murammat <span className="text-[#00ffc4]">Blog</span>
          </h1>
          <p className="text-base sm:text-lg text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
            Discover professional tips, expert guides, and stories about home maintenance, repairs, and visual improvements.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl max-w-2xl mx-auto">
            <p className="text-xl font-bold text-[#00ffc4] mb-2">No posts available yet</p>
            <p className="text-sm text-emerald-100/60">Check back soon for awesome guides and stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                to={`/blog/${blog.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] border border-gray-100/10 hover:border-[#00ffc4]/30 hover:shadow-[0_20px_45px_rgba(0,255,196,0.1)] transition-all duration-500 group flex flex-col transform hover:-translate-y-1.5 will-change-transform"
              >
                {/* Image Section */}
                <div className="aspect-[16/10] w-full bg-white/5 relative overflow-hidden">
                  {blog.image_url ? (
                    <img 
                      src={getImageUrl(blog.image_url)} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 will-change-transform" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00674F]/10 to-[#00ffc4]/5">
                      <span className="text-[#00ffc4]/30 font-extrabold text-xl tracking-wider uppercase">Murammat</span>
                    </div>
                  )}
                  {/* Category tag */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#00ffc4] shadow-sm">
                    {getCategoryTag(blog.title)}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col bg-[#002f23]/95 text-emerald-50">
                  <div className="flex items-center text-[11px] font-medium text-emerald-100/60 mb-3 space-x-4">
                    <span className="flex items-center"><Calendar size={13} className="mr-1.5 text-[#00ffc4]" /> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center"><User size={13} className="mr-1.5 text-[#00ffc4]" /> {blog.author || 'Admin'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ffc4] transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-emerald-100/70 line-clamp-3 text-xs leading-relaxed mb-5 flex-1">
                    {blog.content}
                  </p>
                  <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[#00ffc4] font-bold text-xs uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article <span>→</span>
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
