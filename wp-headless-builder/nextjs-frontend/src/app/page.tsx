'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { api, getImagePath } from '@/lib/api';
import { BuilderContainer } from '@/components/builder/BuilderContainer';

export default function BuilderPage() {
  const { setPageId, setLayout, setIsEditing } = useBuilderStore();
  
  useEffect(() => {
    // Initialize builder from window config
    const config = window.headlessBuilderConfig;
    
    if (config?.postId) {
      setPageId(config.postId);
      
      // Load page data
      api.getPage(config.postId)
        .then((response) => {
          if (response.success && response.data) {
            setLayout(response.data.layout);
          }
        })
        .catch((error) => {
          console.error('Failed to load page:', error);
        });
    }
    
    // Enable editing mode
    setIsEditing(config?.canEdit || false);
    
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Save handler would go here
      }
      
      // Ctrl/Cmd + Z to undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        // Undo handler
      }
      
      // Ctrl/Cmd + Shift + Z to redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        // Redo handler
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPageId, setLayout, setIsEditing]);
  
  return (
    <div className="builder-container">
      <BuilderContainer />
    </div>
  );
}
