'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

export function RightRail() {
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'settings'>('design');
  const { selectedSectionId, layout } = useBuilderStore();
  
  const selectedSection = layout?.sections.find(s => s.id === selectedSectionId);
  
  return (
    <div className="builder-right-rail">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'design'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Design
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Settings
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedSection ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p>Select a section to edit its properties</p>
          </div>
        ) : (
          <>
            {activeTab === 'design' && (
              <DesignPanel section={selectedSection} />
            )}
            
            {activeTab === 'content' && (
              <ContentPanel section={selectedSection} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsPanel section={selectedSection} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DesignPanel({ section }: { section: any }) {
  return (
    <div className="space-y-6">
      {/* Layout Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Layout</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
            <select className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
              <option value="full">Full Width</option>
              <option value="boxed">Boxed</option>
              <option value="narrow">Narrow</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vertical Align</label>
            <div className="flex space-x-2">
              {['top', 'middle', 'bottom'].map((align) => (
                <button
                  key={align}
                  className="flex-1 py-2 px-3 text-xs border rounded-md hover:bg-gray-50 capitalize"
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacing */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Spacing</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Padding Top</label>
            <input type="text" className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="0px" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Padding Bottom</label>
            <input type="text" className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="0px" />
          </div>
        </div>
      </div>
      
      {/* Background */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Background</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
            <div className="flex items-center space-x-2">
              <input type="color" className="w-8 h-8 border rounded cursor-pointer" defaultValue="#ffffff" />
              <input type="text" className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="#ffffff" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
            <button className="w-full py-2 px-3 text-xs border-2 border-dashed border-gray-300 rounded-md hover:border-primary-500 hover:text-primary-600 transition-colors">
              Upload Image
            </button>
          </div>
        </div>
      </div>
      
      {/* Borders */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Borders</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
            <input type="text" className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="0px" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPanel({ section }: { section: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Modules</h3>
      
      {section.modules.map((module: any, index: number) => (
        <div key={module.id} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">{module.type}</span>
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Click to edit content inline on the canvas
          </div>
        </div>
      ))}
      
      <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors">
        + Add Module
      </button>
    </div>
  );
}

function SettingsPanel({ section }: { section: any }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Label</label>
        <input 
          type="text" 
          className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
          defaultValue={section.adminLabel}
          placeholder="Enter admin label"
        />
        <p className="mt-1 text-xs text-gray-500">Internal name for easy identification</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CSS Class</label>
        <input 
          type="text" 
          className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="custom-class"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CSS ID</label>
        <input 
          type="text" 
          className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="custom-id"
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Visibility</h4>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked={section.isVisible} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-gray-700">Show Section</span>
          </label>
          
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-gray-700">Desktop</span>
          </label>
          
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-gray-700">Tablet</span>
          </label>
          
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-gray-700">Mobile</span>
          </label>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors">
          Delete Section
        </button>
      </div>
    </div>
  );
}
