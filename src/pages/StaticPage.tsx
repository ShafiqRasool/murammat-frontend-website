import React, { useEffect, useState } from 'react';
import API from '../utils/api';

interface StaticPageProps {
  id: string;
}

interface PageData {
  title: string;
  content: string;
}

const StaticPage: React.FC<StaticPageProps> = ({ id }) => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(`/public/pages/${id}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load page:', err);
        setError('Failed to load page content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [id]);

  // Strip html structure and return styled content safely
  const getCleanHtml = () => {
    if (!data?.content) return '';
    let html = data.content;

    // Check if it's a full HTML page
    if (html.includes('<html') || html.includes('<body')) {
      // Extract the style tags
      const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      let styles = styleMatches ? styleMatches[0] : '';
      
      // Scope body styles to prevent polluting global body
      if (styles) {
        styles = styles.replace(/\bbody\b/g, '.privacy-policy-body');
      }
      
      // Extract body content
      const bodyMatches = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let bodyContent = bodyMatches ? bodyMatches[1] : html;
      
      // Wrap body content in a class to match scoped styles
      return `${styles}\n<div class="privacy-policy-body">${bodyContent}</div>`;
    }
    return html;
  };

  // Determine if content has its own title/header
  const hasEmbeddedTitle = () => {
    const html = data?.content || '';
    return html.includes('<h1') || html.includes('<h1>');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-2 bg-gradient-to-r from-[#00674F] to-[#00a87a]"></div>
        
        <div className="p-8 sm:p-12 md:p-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-[#00674F] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-medium">Loading content...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">!</div>
              <p className="text-slate-600 font-semibold">{error}</p>
            </div>
          ) : (
            <article className="prose prose-slate max-w-none">
              {!hasEmbeddedTitle() && (
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-100">
                  {data?.title}
                </h1>
              )}
              <div 
                className="text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: getCleanHtml() }}
              />
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
