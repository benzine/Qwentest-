'use client';

export function ModuleLibrary() {
  const moduleCategories = [
    {
      name: 'Basic',
      modules: [
        { type: 'heading', label: 'Heading', icon: 'H' },
        { type: 'text', label: 'Text', icon: 'T' },
        { type: 'image', label: 'Image', icon: '🖼️' },
        { type: 'button', label: 'Button', icon: '⬚' },
        { type: 'divider', label: 'Divider', icon: '—' },
      ],
    },
    {
      name: 'Content',
      modules: [
        { type: 'icon-box', label: 'Icon Box', icon: '□' },
        { type: 'feature-list', label: 'Feature List', icon: '✓' },
        { type: 'testimonial', label: 'Testimonial', icon: '"' },
        { type: 'pricing-table', label: 'Pricing Table', icon: '$' },
        { type: 'accordion', label: 'Accordion', icon: '▾' },
        { type: 'tabs', label: 'Tabs', icon: '▤' },
      ],
    },
    {
      name: 'Media',
      modules: [
        { type: 'gallery', label: 'Gallery', icon: '⊞' },
        { type: 'carousel', label: 'Carousel', icon: '◫' },
        { type: 'video', label: 'Video', icon: '▶' },
        { type: 'map', label: 'Map', icon: '📍' },
      ],
    },
    {
      name: 'Forms',
      modules: [
        { type: 'contact-form', label: 'Contact Form', icon: '✉' },
        { type: 'newsletter', label: 'Newsletter', icon: '📧' },
        { type: 'search', label: 'Search', icon: '🔍' },
      ],
    },
    {
      name: 'Interactive',
      modules: [
        { type: 'countdown', label: 'Countdown', icon: '⏱' },
        { type: 'progress-bar', label: 'Progress Bar', icon: '▓' },
        { type: 'social-share', label: 'Social Share', icon: '🔗' },
      ],
    },
  ];
  
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Modules</h3>
      
      {moduleCategories.map((category) => (
        <div key={category.name} className="mb-6">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            {category.name}
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {category.modules.map((module) => (
              <button
                key={module.type}
                className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded text-sm mr-3 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {module.icon}
                </span>
                <span className="text-xs text-gray-300 group-hover:text-white">
                  {module.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
