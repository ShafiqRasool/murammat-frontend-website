import React from 'react';

interface SubcategoryDescriptionProps {
  title: string;
  description: string;
}

// ── Helper: parse a single line's inline **bold** markers ────────────────
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

const SubcategoryDescription: React.FC<SubcategoryDescriptionProps> = ({ title, description }) => {
  if (!description) return null;

  // If it has HTML tags, render with dangerouslySetInnerHTML (old behaviour)
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
            <div className="space-y-2 leading-relaxed">
              {description.split('\n').map((line, idx) => {
                if (!line.trim()) return <div key={idx} className="h-2" />;

                // Bullet line: starts with '• '
                if (line.startsWith('• ')) {
                  return (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="mt-1 text-[#00674F] font-bold flex-shrink-0">•</span>
                      <span>{parseInline(line.slice(2))}</span>
                    </div>
                  );
                }

                // Normal paragraph with possible **bold**
                return (
                  <p key={idx}>{parseInline(line)}</p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryDescription;
