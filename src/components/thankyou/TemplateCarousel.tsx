"use client";

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  html: string;
}

interface TemplateCarouselProps {
  templates: Template[];
  selectedTemplateId?: string;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateCarousel({ templates, selectedTemplateId, onSelectTemplate }: TemplateCarouselProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const generateThumbnail = (template: Template) => {
    // For now, return a simple colored placeholder
    // In a real implementation, you'd generate actual thumbnails
    const colors = {
      'minimal-ivory': 'bg-white border-2 border-brand-200',
      'blush-frame': 'bg-white border-2 border-accent',
      'sage-leafline': 'bg-brand-50 border-2 border-brand-300',
      'photo-header': 'bg-gradient-to-br from-primary to-accent',
      'modern-monogram': 'bg-brand-100 border-2 border-brand-400',
      'ribbon-divider': 'bg-white border-2 border-warning',
    };
    
    return colors[template.slug as keyof typeof colors] || 'bg-brand-50 border-2 border-brand-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl text-ink mb-2">Choose a Template</h2>
        <p className="text-muted">Select a beautiful design for your thank-you notes</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`card p-6 cursor-pointer transition-all ${
              selectedTemplateId === template.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {/* Thumbnail */}
            <div className={`w-full h-32 rounded-lg mb-4 ${generateThumbnail(template)} flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-2xl mb-1">💌</div>
                <div className="text-xs text-muted font-medium">Preview</div>
              </div>
            </div>
            
            {/* Template Info */}
            <div className="text-center">
              <h3 className="font-medium text-ink mb-1">{template.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template);
                }}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-brand-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl text-ink">{previewTemplate.name} Preview</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-muted hover:text-ink transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div 
                className="border border-brand-200 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ 
                  __html: previewTemplate.html.replace(/{{[^}]+}}/g, 'Sample Text') 
                }}
              />
            </div>
            <div className="p-6 border-t border-brand-200">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="btn-primary"
                >
                  Select This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="btn-secondary"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
