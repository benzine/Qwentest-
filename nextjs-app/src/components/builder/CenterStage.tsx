'use client';

import { useBuilderStore } from '@/store/useBuilderStore';
import { DEVICE_PREVIEWS } from '@/types';

export function CenterStage() {
  const { 
    viewMode, 
    setViewMode, 
    devicePreview, 
    setDevicePreview,
    selectedSectionId,
    setSelectedSection,
    layout 
  } = useBuilderStore();
  
  const selectedSection = layout?.sections.find(s => s.id === selectedSectionId);
  
  return (
    <div className="builder-center-stage">
      {/* Toolbar */}
      <div className="center-stage-toolbar">
        <div className="flex items-center space-x-4">
          {viewMode === 'isolated-section' && (
            <button
              onClick={() => {
                setViewMode('full-page');
                setSelectedSection(null);
              }}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Full Page
            </button>
          )}
          
          {selectedSection && viewMode === 'isolated-section' && (
            <span className="text-sm font-medium text-gray-900">
              {selectedSection.adminLabel || selectedSection.type}
            </span>
          )}
        </div>
        
        {/* Section toolbar actions */}
        {viewMode === 'isolated-section' && selectedSection && (
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Rename">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Show/Hide">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {selectedSection.isVisible ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                )}
              </svg>
            </button>
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Move Up">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Move Down">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Duplicate">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title="Delete">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Device preview toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {DEVICE_PREVIEWS.map((device) => (
            <button
              key={device.type}
              onClick={() => setDevicePreview(device.type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                devicePreview === device.type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title={device.label}
            >
              {device.type === 'desktop' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {device.type === 'tablet' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {device.type === 'mobile' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Canvas */}
      <div className="center-stage-canvas">
        <div className={`section-isolated ${
          devicePreview === 'tablet' ? 'device-tablet' : 
          devicePreview === 'mobile' ? 'device-mobile' : 'device-desktop'
        }`}>
          {viewMode === 'isolated-section' && selectedSection ? (
            <div className="p-4">
              {/* Render isolated section */}
              <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 min-h-[400px] bg-gray-50">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">{selectedSection.adminLabel || selectedSection.type}</p>
                  <p className="text-sm">{selectedSection.modules.length} modules in this section</p>
                  <p className="text-xs mt-4 text-gray-400">Click elements to edit inline</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Render full page with all sections */}
              {layout?.sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setViewMode('isolated-section');
                  }}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer transition-colors bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {section.adminLabel || section.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {section.modules.length} modules
                    </span>
                  </div>
                  <div className="h-24 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm">
                    Section Preview
                  </div>
                </div>
              ))}
              
              {(!layout || layout.sections.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No sections yet</p>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                    Add Your First Section
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
