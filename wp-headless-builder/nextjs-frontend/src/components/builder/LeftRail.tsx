'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { SectionTree } from './SectionTree';
import { ModuleLibrary } from './ModuleLibrary';

export function LeftRail() {
  const [activeTab, setActiveTab] = useState<'sections' | 'library'>('sections');
  const { layout } = useBuilderStore();
  
  return (
    <div className="builder-left-rail">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'sections'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Sections
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'library'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Library
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto hidden-scroll">
        {activeTab === 'sections' && layout && (
          <SectionTree sections={layout.sections} />
        )}
        
        {activeTab === 'library' && (
          <ModuleLibrary />
        )}
      </div>
      
      {/* Actions */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors mb-2">
          Add Section
        </button>
        <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors">
          Save Draft
        </button>
      </div>
    </div>
  );
}
