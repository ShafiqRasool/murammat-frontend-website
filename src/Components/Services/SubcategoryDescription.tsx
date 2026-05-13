import React from 'react';

interface SubcategoryDescriptionProps {
  title: string;
  description: string;
}

const SubcategoryDescription: React.FC<SubcategoryDescriptionProps> = ({ title, description }) => {
  if (!description) return null;

  // Check if it contains HTML tags, if not we format plain text nicely
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(description);

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          {title}
        </h2>
        
        <div className="prose prose-lg prose-emerald max-w-none text-gray-600">
          {isHtml ? (
            <div 
              className="rich-text-container space-y-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }} 
            />
          ) : (
            <div className="space-y-4 leading-relaxed">
              {description.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryDescription;
